import React from "react";

export default function Testing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          Tailwind CSS Test
        </h1>
        <p className="text-center text-purple-300 text-lg mb-12">
          Verify that Tailwind CSS is working correctly
        </p>

        {/* Color Palette Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Red
            </div>
            <div className="bg-blue-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Blue
            </div>
            <div className="bg-green-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Green
            </div>
            <div className="bg-purple-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Purple
            </div>
            <div className="bg-yellow-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Yellow
            </div>
            <div className="bg-pink-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Pink
            </div>
            <div className="bg-indigo-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Indigo
            </div>
            <div className="bg-cyan-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Cyan
            </div>
          </div>
        </section>

        {/* Typography Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Typography</h2>
          <div className="space-y-4 bg-slate-800 p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-white">Heading 3xl Bold</h3>
            <h4 className="text-2xl font-semibold text-gray-200">
              Heading 2xl Semibold
            </h4>
            <h5 className="text-xl font-medium text-gray-300">
              Heading xl Medium
            </h5>
            <p className="text-base text-gray-400">
              Body text with base size. This is a paragraph to test regular font
              weight and color.
            </p>
            <p className="text-sm text-gray-500">
              Small text with sm size for captions and helper text.
            </p>
          </div>
        </section>

        {/* Spacing & Layout Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Spacing & Layout
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-white font-semibold mb-3">Card 1</h3>
              <p className="text-blue-100 text-sm">
                This is a card with padding, gradient, and hover effect.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-white font-semibold mb-3">Card 2</h3>
              <p className="text-emerald-100 text-sm">
                This is another card with different colors.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-white font-semibold mb-3">Card 3</h3>
              <p className="text-orange-100 text-sm">
                Try hovering over these cards for effects.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-slate-900 transition-all">
              Outline Button
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
              Gradient Button
            </button>
          </div>
        </section>

        {/* Responsive Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Responsive Design
          </h2>
          <div className="bg-slate-800 p-8 rounded-lg">
            <p className="text-gray-300 mb-4">
              Resize your window to see responsive behavior:
            </p>
            <div className="hidden sm:block md:hidden text-yellow-300">
              📱 Small Screen (sm)
            </div>
            <div className="hidden md:block lg:hidden text-green-300">
              📱 Medium Screen (md)
            </div>
            <div className="hidden lg:block text-blue-300">
              🖥️ Large Screen (lg)
            </div>
          </div>
        </section>

        {/* Status Indicators */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Status Indicators
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-green-900 bg-opacity-30 border border-green-500 p-4 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-300">✓ Tailwind is working!</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-900 bg-opacity-30 border border-blue-500 p-4 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-300">ℹ All styles are applied</span>
            </div>
            <div className="flex items-center gap-3 bg-purple-900 bg-opacity-30 border border-purple-500 p-4 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-purple-300">✨ Ready to build!</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-700">
          <p className="text-gray-400">
            If you can see colored boxes, buttons, and styled text above,
            <br />
            <span className="text-green-400 font-semibold">
              Tailwind CSS is working correctly!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}