'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  TruckIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon,
  UsersIcon,
  TrophyIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

export default function AboutUsPage() {
  const stats = [
    { label: 'Happy Customers', value: '500K+', icon: UsersIcon },
    { label: 'Products Sold', value: '2M+', icon: StarIcon },
    { label: 'Countries Served', value: '50+', icon: GlobeAltIcon },
    { label: 'Years of Excellence', value: '10+', icon: TrophyIcon },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We never compromise on quality. Every product undergoes rigorous quality checks.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Customer Centric',
      description: 'Your satisfaction is our priority. We\'re here to help 24/7.',
      icon: HeartIcon,
    },
    {
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders to you ASAP.',
      icon: TruckIcon,
    },
    {
      title: 'Innovation',
      description: 'Constantly evolving to bring you the best products and experience.',
      icon: SparklesIcon,
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/images/team/sarah.jpg',
      bio: '10+ years in e-commerce industry',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '/images/team/michael.jpg',
      bio: 'Supply chain expert',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience',
      image: '/images/team/emily.jpg',
      bio: 'Passionate about customer success',
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: '/images/team/david.jpg',
      bio: 'Product innovation specialist',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-600">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="About Us"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
              <p className="text-xl md:text-2xl text-gray-200">
                Building the future of e-commerce, one happy customer at a time
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            To revolutionize online shopping by providing high-quality products, 
            exceptional customer service, and a seamless shopping experience that 
            brings joy to every customer.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">How It All Started</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2014, ShopHub began with a simple idea: make quality products 
                accessible to everyone. What started as a small garage operation has grown 
                into a thriving e-commerce platform serving hundreds of thousands of customers worldwide.
              </p>
              <p>
                {`Our journey hasn't always been easy, but our commitment to excellence and 
                customer satisfaction has never wavered. We've built strong relationships 
                with manufacturers and suppliers to ensure we always offer the best products 
                at competitive prices.`}
              </p>
              <p>
                {`Today, we're proud to be a trusted name in online retail, but we're just 
                getting started. We continue to innovate and improve, always with our 
                customers at the heart of everything we do.`}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/about-story.jpg"
              alt="Our Story"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at ShopHub
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-gray-50 rounded-xl"
                >
                  <div className="inline-flex p-3 bg-white rounded-full mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {`The passionate people behind ShopHub's success`}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-500 mt-2">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of something special. Shop with us today and experience the difference.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}