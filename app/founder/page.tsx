"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, Twitter, Linkedin, Github, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FounderPage() {
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
              <Link href="/about">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to About
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Founder</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The vision and passion behind Ailuminate's mission to empower creators worldwide.
          </p>
        </div>

        {/* Founder Card */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">AI Luminate Team</CardTitle>
            <CardDescription className="text-lg">Founder & CEO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                Welcome to Ailuminate! I'm thrilled to share the story behind this platform and the vision that drives
                us every day.
              </p>
              <p>
                As a passionate advocate for knowledge sharing and community building, I founded Ailuminate with a
                simple yet powerful mission: to create a space where every voice matters and every story has the
                potential to inspire, educate, and connect people across the globe.
              </p>
              <p>
                My journey in technology and content creation has taught me that the most meaningful innovations happen
                when we combine cutting-edge technology with genuine human connection. Ailuminate represents this
                philosophy – a platform that leverages modern web technologies to foster authentic relationships and
                meaningful content sharing.
              </p>
            </div>

            {/* Contact Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Let's Connect</h3>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To build the world's most creator-friendly platform where knowledge flows freely, creativity is
                celebrated, and every individual has the tools they need to share their unique perspective with a global
                audience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Ailuminate?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                In a world saturated with content, we believe quality and authenticity should prevail. Ailuminate is
                designed to reward meaningful content creation and foster genuine connections between creators and their
                audiences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg mb-6 opacity-90">
            Be part of a community that values creativity, authenticity, and meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Creating Today
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
