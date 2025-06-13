'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Star,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Home,
  Car,
  Briefcase,
  Wrench,
  Camera,
  BookOpen,
  Heart,
  Truck,
  Play,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Amara Okafor",
      location: "Lagos, Nigeria",
      text: "DuoTasks helped me find reliable help for my home repairs. The community here truly understands our needs.",
      rating: 5,
      task: "Home Maintenance"
    },
    {
      name: "Kwame Asante",
      location: "Accra, Ghana",
      text: "As a skilled carpenter, I've built my business through DuoTasks. The platform connects me with people who value quality work.",
      rating: 5,
      task: "Furniture Making"
    },
    {
      name: "Fatima Hassan",
      location: "Nairobi, Kenya",
      text: "From tutoring to event planning, DuoTasks has become my go-to platform. It's built for us, by us.",
      rating: 5,
      task: "Education & Events"
    }
  ];

  const taskCategories = [
    { icon: Home, name: "Home & Garden", count: "2,500+ tasks", color: "bg-emerald-100 text-emerald-700" },
    { icon: Car, name: "Automotive", count: "800+ tasks", color: "bg-blue-100 text-blue-700" },
    { icon: Briefcase, name: "Business", count: "1,200+ tasks", color: "bg-purple-100 text-purple-700" },
    { icon: Wrench, name: "Handyman", count: "3,000+ tasks", color: "bg-orange-100 text-orange-700" },
    { icon: Camera, name: "Creative", count: "900+ tasks", color: "bg-pink-100 text-pink-700" },
    { icon: BookOpen, name: "Education", count: "1,500+ tasks", color: "bg-indigo-100 text-indigo-700" },
    { icon: Heart, name: "Personal Care", count: "600+ tasks", color: "bg-red-100 text-red-700" },
    { icon: Truck, name: "Delivery", count: "2,000+ tasks", color: "bg-yellow-100 text-yellow-700" }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Matching",
      description: "Connect with skilled taskers in minutes, not hours. Our algorithm understands African work culture.",
      stat: "< 5 min average"
    },
    {
      icon: Shield,
      title: "Trust & Safety First",
      description: "Every tasker is verified. Every task is protected. Built with African community values at heart.",
      stat: "99.8% safe tasks"
    },
    {
      icon: Globe,
      title: "Pan-African Network",
      description: "From Cape Town to Cairo, access skills and opportunities across the continent.",
      stat: "15+ countries"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for African mobile networks. Works seamlessly even on 2G connections.",
      stat: "Works on 2G+"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DT</span>
                </div>
                <span className="text-xl font-bold text-slate-900">DuoTasks</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
                <a href="#categories" className="text-slate-600 hover:text-emerald-600 transition-colors">Categories</a>
                <a href="#testimonials" className="text-slate-600 hover:text-emerald-600 transition-colors">Stories</a>
                <Link href="/settings">
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Sign In
                  </Button>
                </Link>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Tuko Pamoja - Join Us
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                  className="md:hidden p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="md:hidden bg-white border-t border-emerald-100">
                <div className="px-4 py-4 space-y-4">
                  <a href="#features" className="block text-slate-600 hover:text-emerald-600">Features</a>
                  <a href="#categories" className="block text-slate-600 hover:text-emerald-600">Categories</a>
                  <a href="#testimonials" className="block text-slate-600 hover:text-emerald-600">Stories</a>
                  <div className="pt-4 space-y-2">
                    <Link href="/settings" className="block">
                      <Button variant="outline" className="w-full border-emerald-200 text-emerald-700">
                        Sign In
                      </Button>
                    </Link>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Tuko Pamoja - Join Us
                    </Button>
                  </div>
                </div>
              </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* African Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l-15-15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    African Innovation Meets Global Efficiency
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                    Get Things Done,
                    <span className="text-emerald-600 block">The African Way</span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Connect with skilled taskers across Africa. From home repairs to business solutions,
                    we bring Ubuntu spirit to the gig economy. <em>"Umuntu ngumuntu ngabantu"</em> -
                    A person is a person through other people.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                    Anza Sasa - Start Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Watch How It Works
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">50K+</div>
                    <div className="text-sm text-slate-600">Active Taskers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">200K+</div>
                    <div className="text-sm text-slate-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">4.9★</div>
                    <div className="text-sm text-slate-600">Average Rating</div>
                  </div>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-200 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-300 rounded-full opacity-30" />

                  {/* Simulated App Interface */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Find a Tasker</h3>
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">KM</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">Kwame M.</div>
                          <div className="text-sm text-slate-600">Plumber • 4.9★ • 2km away</div>
                        </div>
                        <div className="text-emerald-600 font-semibold">KSh 2,500</div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">AN</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">Amina N.</div>
                          <div className="text-sm text-slate-600">Electrician • 4.8★ • 1.5km away</div>
                        </div>
                        <div className="text-emerald-600 font-semibold">KSh 3,000</div>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Book Now - Haraka!
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Built for African Excellence
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We understand the unique challenges and opportunities across Africa.
                Our platform is designed to work seamlessly in our diverse environments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                        <feature.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 mb-4">{feature.description}</p>
                      <div className="text-emerald-600 font-bold text-lg">{feature.stat}</div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Task Categories */}
        <section id="categories" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Every Skill, Every Need
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From traditional crafts to modern services, find the right person for any task.
                <em>"Haba na haba, hujaza kibaba"</em> - Little by little fills the measure.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {taskCategories.map((category, index) => (
                  <div
                      key={index}
                      className="group cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-emerald-200"
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-slate-600">{category.count}</p>
                    <div className="flex items-center text-emerald-600 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Stories from Our Community
              </h2>
              <p className="text-xl text-slate-600">
                Real people, real results. Hear how DuoTasks is transforming lives across Africa.
              </p>
            </div>

            <div className="relative">
              <Card className="border-0 shadow-xl max-w-4xl mx-auto">
                <CardContent className="p-12 text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-2xl text-slate-700 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-slate-600">
                      {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].task}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentTestimonial ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                        onClick={() => setCurrentTestimonial(index)}
                    />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Ready to Join the Movement?
              </h2>
              <p className="text-xl text-emerald-100">
                Whether you need help or want to help others, DuoTasks connects our community.
                Together, we build a stronger Africa, one task at a time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold">
                  Jiunge Nasi - Join Us Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
                  Learn More About Us
                </Button>
              </div>

              <div className="pt-8 text-emerald-100">
                <p className="text-sm">
                  "Ukweli hauogopi upelelezi" - Truth does not fear investigation.
                  Try DuoTasks risk-free today.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-emerald-f00 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DT</span>
                  </div>
                  <span className="text-xl font-bold">DuoTasks</span>
                </div>
                <p className="text-slate-400">
                  Connecting Africa through skills, trust, and opportunity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <div className="space-y-2 text-slate-400">
                  <div>How it Works</div>
                  <div>Safety</div>
                  <div>Pricing</div>
                  <div>Support</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <div className="space-y-2 text-slate-400">
                  <div>Become a Tasker</div>
                  <div>Success Stories</div>
                  <div>Blog</div>
                  <div>Events</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-slate-400">
                  <div>About Us</div>
                  <div>Careers</div>
                  <div>Press</div>
                  <div>Contact</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
              <p>&copy; 2024 DuoTasks. Made with ❤️ in Africa, for Africa.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}