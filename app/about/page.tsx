"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Users, Target, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ailuminate
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/articles">
                <Button variant="ghost">Articles</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            About Ailuminate
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering creators to share their knowledge, connect with like-minded individuals, and build a community of
            learners and innovators.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To create a platform where knowledge flows freely, creativity thrives, and every voice has the power to
                inspire and educate.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A diverse community of writers, thinkers, and creators from all walks of life, united by their passion
                for sharing knowledge.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We believe in authenticity, respect, continuous learning, and the power of community to drive positive
                change.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                Ailuminate was born from a simple belief: everyone has something valuable to share. In a world
                overflowing with information, we wanted to create a space where quality content and meaningful
                connections could flourish.
              </p>
              <p className="mb-6">
                Our platform combines the best of blogging, social networking, and knowledge sharing to create an
                environment where creators can focus on what they do best – creating amazing content that educates,
                inspires, and entertains.
              </p>
              <p>
                Whether you're a seasoned writer, a passionate hobbyist, or someone just starting their creative
                journey, Ailuminate provides the tools and community you need to share your unique perspective with the
                world.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Creator-First Approach</h3>
              <p className="text-gray-600">
                We put creators at the center of everything we do, providing intuitive tools and features that make
                content creation enjoyable and rewarding.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Community-Driven</h3>
              <p className="text-gray-600">
                Our platform thrives on community interaction, fostering meaningful discussions and connections between
                creators and readers.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quality Over Quantity</h3>
              <p className="text-gray-600">
                We prioritize high-quality content and authentic engagement over viral trends and superficial metrics.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Privacy & Respect</h3>
              <p className="text-gray-600">
                Your privacy matters to us. We're committed to creating a safe, respectful environment for all our
                users.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey as a creator and connect with thousands of like-minded individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
