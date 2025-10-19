<template>
  <div class="p-4 bg-blue-100 h-screen flex items-center justify-center bg-container">
    <!-- Left Column: Form -->

    <div
      v-if="!itinerary"
      class="opacity-95 relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(160,64,255,0.1)] p-10 border border-purple-100 overflow-hidden transition-all duration-500"
    >
      <!-- Gradient Overlay Decoration -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 opacity-40 pointer-events-none"
      />

      <form
        class="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
        @submit.prevent="generateItinerary"
      >
        <!-- LEFT: Form Section -->
        <div class="space-y-8 z-10">
          <div>
            <h2 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Plan Your Journey
            </h2>
            <p class="text-gray-600 leading-relaxed text-base">
              Enter your dream destination and let our AI craft the perfect personalized itinerary
              for you — tailored adventures, local spots, and hidden gems included.
            </p>
          </div>

          <!-- Destination Input -->
          <div>
            <label
              for="location"
              class="block text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase"
            >
              Destination
            </label>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  class="w-5 h-5 text-purple-400"
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
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="e.g., Baguio, Cebu, Palawan..."
                @input="search"
              >

              <!-- Suggestion Dropdown -->
              <transition name="fade">
                <ul
                  v-if="results.length"
                  class="absolute z-20 w-full bg-white border-2 border-purple-100 rounded-2xl shadow-xl mt-2 max-h-64 overflow-y-auto"
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
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"
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
          </div>
        </div>

        <!-- RIGHT: Visual / Placeholder Section -->
        <div class="flex flex-col justify-center items-center text-center space-y-6 z-10">
          <div class="relative group">
            <div
              class="absolute -inset-2 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
              alt="Travel illustration"
              class="relative w-48 h-48 group-hover:scale-105 transition-transform duration-500"
            >
          </div>
          <p class="text-lg text-gray-700 italic leading-relaxed max-w-sm">
            “Your next great story begins with one click generate your itinerary and explore beyond
            the map.”
          </p>
        </div>

        <!-- SUBMIT BUTTON -->
        <div class="md:col-span-2">
          <button
            type="submit"
            :disabled="loading"
            class="relative w-full py-5 rounded-2xl font-bold text-white text-lg overflow-hidden bg-gradient-to-r from-green-600 via-white-600 to-orange-500 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading" class="flex items-center justify-center gap-3">
              Generate My Journey
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
        </div>
      </form>
    </div>

    <!-- Right Column: Itinerary Display -->
    <div
      v-else
      class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-orange-100 hover:shadow-orange-200 transition-all duration-300"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Your Itinerary</h2>
        <div class="flex gap-3">
          <button
            class="text-sm text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
            @click="exportPDF"
          >
            Export as PDF
          </button>

          <button
            class="text-sm text-white bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
            @click="resetItinerary"
          >
            Plan Another Trip
          </button>
        </div>
      </div>

      <div
        id="itinerary-content"
        class="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar"
      >
        <div
          v-for="(day, index) in formattedDays"
          :key="index"
          class="bg-gradient-to-br from-white to-orange-50 shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="prose prose-lg max-w-none prose-headings:text-blue-700 prose-strong:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-800"
            v-html="day"
          />
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

  const formattedDays = computed(() => {
    if (!itinerary.value || typeof itinerary.value !== 'string') return []

    // Split into sections per Day
    const sections = itinerary.value.split(/(?=🗓️\s?\*\*Day\s*\d+)/)

    return sections
      .filter((s) => s.trim() !== '')
      .map((section) =>
        DOMPurify.sanitize(
          section
            .replace(
              /🗓️\s?\*\*(.*?)\*\*/g,
              '<h3 class="text-xl font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-1">$1</h3>'
            )
            .replace(/🍽️ Food to Try:/g, '<strong>🍽️ Food to Try:</strong>')
            .replace(/💡 Travel Tip:/g, '<strong>💡 Travel Tip:</strong>')
            .replace(
              /\[([^\]]+)\]\((https:\/\/www\.google\.com\/maps[^)]+)\)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>'
            )

            .replace(
              /🗺️ View all locations on Google Maps/g,
              '<p class="mt-3"><strong>🗺️</strong> <a href="#" class="text-blue-600 underline hover:text-blue-800">View all locations on Google Maps</a></p>'
            )
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
        )
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
  function resetItinerary() {
    itinerary.value = null
    searchQuery.value = ''
    results.value = []
  }

  const exportPDF = async () => {
    if (!itinerary.value) return

    const html = document.getElementById('itinerary-content').outerHTML

    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, fileName: `Itinerary-${searchQuery.value}.pdf` }),
    })

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Itinerary-${searchQuery.value}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  .bg-container {
    /* Set the image as background */
    background-image: url('../assets/images/bg-image.jpg');

    /* Make it cover the entire container */
    background-size: cover;

    /* Center the image */
    background-position: center;

    /* Optional: prevent repeating */
    background-repeat: no-repeat;

    /* Give the container some height */
    height: 100vh; /* Full viewport height */
    width: 100%; /* Full width */

    /* Optional overlay color */
    /* background-color: rgba(0,0,0,0.3); */
  }
</style>
