"use client"

import { motion } from "framer-motion"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { 
  Sparkles, 
  Lightbulb, 
  Users, 
  Zap, 
  Globe, 
  Code, 
  Palette, 
  Database,
  ArrowRight,
  CheckCircle,
  Mail,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react"
import toast from "react-hot-toast"

function DigitalLabPageContent() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/digital-lab/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'digital_lab_page',
          metadata: {
            page: 'digital_lab',
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        if (data.status === 'already_subscribed') {
          toast.success("You're already subscribed to Digital Lab updates!")
        } else {
          toast.success("Successfully subscribed to Digital Lab updates!")
        }
        setEmail("")
      } else {
        throw new Error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "AI-Powered Tools",
      description: "Cutting-edge artificial intelligence to streamline your creative process and enhance productivity."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Digital Art Creation",
      description: "Advanced digital art tools and techniques for modern artists and creators."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Analytics",
      description: "Comprehensive analytics and insights to understand your audience and optimize your work."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Collaboration",
      description: "Connect with artists and creators worldwide through our digital collaboration platform."
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Increased Productivity",
      description: "Streamline your workflow with AI-powered automation"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Community Access",
      description: "Join a network of innovative creators and artists"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Cutting-Edge Technology",
      description: "Access the latest digital tools and techniques"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Focused Learning",
      description: "Structured programs designed for your specific needs"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="pt-20 pb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <Badge variant="default" className="text-lg px-4 py-2">
                Digital Lab Initiative
              </Badge>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Future of Digital Innovation
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Empowering artists, creators, and organizations with cutting-edge digital tools, 
              AI-powered solutions, and collaborative platforms that transform how we create, 
              connect, and innovate in the digital age.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Stay Updated
                <Mail className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          id="features"
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover the tools and technologies that will revolutionize your creative workflow
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="py-16 px-4 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Join Digital Lab?
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Be part of the digital transformation that's reshaping the creative industry
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Email Subscription Section */}
        <motion.section 
          id="subscribe"
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-center space-x-2 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Mail className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-3xl md:text-4xl font-bold">Stay in the Loop</h2>
                  <Mail className="w-8 h-8 text-yellow-300" />
                </motion.div>
                
                <motion.p 
                  className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Get exclusive updates about Digital Lab features, upcoming workshops, 
                  and early access to new tools and technologies.
                </motion.p>

                {!isSubscribed ? (
                  <motion.form 
                    onSubmit={handleEmailSubmit}
                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    className="flex items-center justify-center space-x-2 text-green-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-lg font-semibold">Successfully subscribed!</span>
                  </motion.div>
                )}

                <motion.p 
                  className="text-sm text-white/70 mt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  We respect your privacy. Unsubscribe at any time.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Digital Journey?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the Digital Lab community and be among the first to experience 
                the future of digital innovation and creative technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default function DigitalLabPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DigitalLabPageContent />
    </Suspense>
  );
}
