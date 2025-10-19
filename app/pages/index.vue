<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden"
  >
    <!-- Decorative Elements -->
    <div class="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-3xl" />
    <div
      class="absolute bottom-20 right-20 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-3xl"
    />
    <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-2xl" />

    <div class="container mx-auto px-6 py-12 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 float-animation">
        <h1 class="text-6xl md:text-7xl font-extrabold mb-4">
          <span class="gradient-text">Wanderlust</span>
        </h1>
        <p class="text-xl text-gray-600 font-light">Your AI-Powered Travel Companion</p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <!-- Left Column: Form -->
        <div
          class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-100 hover:shadow-purple-200 transition-all duration-300"
        >
          <div class="flex items-center gap-3 mb-6">
            <h2 class="text-3xl font-bold text-gray-800">Plan Your Journey</h2>
          </div>

          <p class="text-gray-600 mb-8 leading-relaxed">
            Tell us where you want to go, and our AI will craft a personalized itinerary just for
            you. Adventure awaits! 🌍
          </p>

          <form class="space-y-6" @submit.prevent="generateItinerary">
            <div class="relative">
              <label for="location" class="block text-sm font-semibold text-gray-700 mb-2">
                Where to next?
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="location"
                  v-model="searchQuery"
                  type="text"
                  required
                  class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  placeholder="e.g., Laguna, Baguio, Boracay..."
                  @input="search"
                >
              </div>

              <!-- Suggestion Dropdown -->
              <transition name="slide-up">
                <ul
                  v-if="results.length"
                  class="absolute z-20 w-full bg-white border-2 border-purple-100 rounded-2xl shadow-2xl mt-2 max-h-64 overflow-y-auto"
                >
                  <li
                    v-for="(place, index) in results"
                    :key="index"
                    class="px-5 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-0"
                    @click="selectPlace(place)"
                  >
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        />
                      </svg>
                      <div>
                        <div class="font-semibold text-gray-800">{{ place.name }}</div>
                        <div class="text-sm text-gray-500">
                          {{ place.adminName1 }} — {{ place.countryName }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </transition>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading" class="flex items-center justify-center gap-2">
                Generate My Itinerary
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Your Adventure...
              </span>
            </button>
          </form>

          <!-- Travel Icons Decoration -->
          <div class="flex justify-center gap-6 mt-8 text-gray-300">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              />
            </svg>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
              />
            </svg>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
        </div>

        <!-- Right Column: Itinerary Display -->
        <div
          class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-orange-100 hover:shadow-orange-200 transition-all duration-300"
        >
          <transition name="fade" mode="out-in">
            <div v-if="itinerary" key="itinerary" class="h-full">
              <div class="flex items-center gap-3 mb-6">
                <h2 class="text-3xl font-bold text-gray-800">Your Itinerary</h2>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="prose prose-lg max-w-none overflow-y-auto max-h-[600px] pr-2 custom-scrollbar"
                v-html="formattedItinerary"
              />
            </div>

            <div
              v-else
              key="placeholder"
              class="h-full flex flex-col justify-center items-center text-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                alt="Travel illustration"
                class="w-40 h-40 mb-6 opacity-80"
              >
              <p class="text-lg italic">
                Your next adventure awaits — generate an itinerary to begin your journey.
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import DOMPurify from 'dompurify'
  const itinerary = ref(null)
  const loading = ref(false)
  const searchQuery = ref('')

  const formattedItinerary = computed(() => {
    if (!itinerary.value || typeof itinerary.value !== 'string') return ''
    return DOMPurify.sanitize(
      itinerary.value
        .replace(
          /🗓️\s?\*\*(.*?)\*\*/g,
          '<h3 class="text-lg font-semibold text-blue-700 mt-4">$1</h3>'
        )
        .replace(/🍽️ Food to Try:/g, '<strong>🍽️ Food to Try:</strong>')
        .replace(/💡 Travel Tip:/g, '<strong>💡 Travel Tip:</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
    )
  })

  const generateItinerary = async () => {
    loading.value = true
    try {
      const { itinerary: text } = await $fetch('/api/generate-itenerary', {
        method: 'POST',
        body: { location: searchQuery.value },
      })
      itinerary.value = text // make sure this is a plain string
    } finally {
      loading.value = false
    }
  }

  const results = ref([])
  let timeout

  const search = async () => {
    clearTimeout(timeout)
    if (!searchQuery.value) {
      results.value = []
      return
    }

    timeout = setTimeout(async () => {
      try {
        const res = await $fetch(`/api/geonames?q=${searchQuery.value}`)
        results.value = res.geonames || []
      } catch (error) {
        console.error('GeoNames API error:', error)
      }
    }, 400)
  }

  const selectPlace = (place) => {
    searchQuery.value = place.name
    results.value = []
  }
</script>

<style scoped>
  * {
    font-family: 'Poppins', sans-serif;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active {
    transition: all 0.4s ease-out;
  }
  .slide-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes plane-fly {
    0% {
      transform: translateX(-100%) rotate(-15deg);
    }
    100% {
      transform: translateX(100vw) rotate(-15deg);
    }
  }
  .plane-animation {
    animation: plane-fly 15s linear infinite;
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
