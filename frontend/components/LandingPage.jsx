import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Video,
  MessageSquare,
  ShieldCheck,
  Users,
  Sparkles,
  Globe,
  ArrowRight,
  Check,
  CheckCheck,
  Star,
  Mic,
  Smile,
  Menu,
  X,
  Send,
  Lock,
  Zap,
  Shield,
  Activity,
  Paperclip,
  FileText,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeUiTab, setActiveUiTab] = useState('full'); // 'full' | 'chat'

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#ffffff] font-sans antialiased selection:bg-[#ffffff] selection:text-[#000000]">
      
      {/* 1. STICKY NAVBAR — Speakify Monochromatic Minimalist Style */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#000000]/95 border-b border-[#222222] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Voice Chat Icon */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffffff] text-[#000000] flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-transform duration-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#ffffff]">
                Speakify
              </span>
              <span className="text-[10px] font-semibold text-[#00cc66] tracking-wider uppercase -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00cc66] animate-ping" />
                speakify.kanishk.online
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#b3b3b3]">
            <button
              onClick={() => scrollToSection('real-ui')}
              className="hover:text-[#ffffff] transition-colors duration-200"
            >
              Chat UI
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#ffffff] transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#ffffff] transition-colors duration-200"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('community')}
              className="hover:text-[#ffffff] transition-colors duration-200"
            >
              Community
            </button>
          </nav>

          {/* Desktop Header Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLoginClick}
              className="px-5 py-2.5 text-sm font-semibold text-[#b3b3b3] hover:text-[#ffffff] hover:bg-[#111111] rounded-xl border border-transparent hover:border-[#222222] transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#ffffff] text-[#000000] hover:bg-[#e0e0e0] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#111111] border border-[#222222] text-[#ffffff]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-[#222222] px-6 py-6 space-y-4 animate-slide-up">
            <button
              onClick={() => scrollToSection('real-ui')}
              className="block w-full text-left py-2 text-base font-medium text-[#b3b3b3] hover:text-[#ffffff]"
            >
              Chat UI
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-base font-medium text-[#b3b3b3] hover:text-[#ffffff]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-base font-medium text-[#b3b3b3] hover:text-[#ffffff]"
            >
              How It Works
            </button>

            <div className="pt-4 border-t border-[#222222] flex flex-col gap-3">
              <button
                onClick={handleLoginClick}
                className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-[#111111] border border-[#222222] text-[#ffffff]"
              >
                Sign In
              </button>
              <button
                onClick={handleRegisterClick}
                className="w-full py-3 text-center text-sm font-bold rounded-xl bg-[#ffffff] text-[#000000]"
              >
                Start Chatting Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION — Down-to-Up Slide-In Animations */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Badge: Pure Web Application */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111111] border border-[#222222] text-sm text-[#b3b3b3] animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-[#00cc66] animate-pulse" />
            <span className="font-semibold text-[#ffffff]">100% In-Browser Web App</span>
            <span className="text-[#444444]">·</span>
            <span>No App Download Required</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-slide-up-delay-1 text-[#ffffff]">
            Real-time voice, video & messaging.{' '}
            <span className="text-[#888888] font-normal block sm:inline">
              Directly on the web.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto font-normal leading-relaxed animate-slide-up-delay-2">
            Speakify is your private, high-speed communication workspace. Enjoy crystal clear 
            WebRTC voice and video calling, instant group rooms, and uncompressed media sharing on any browser.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-slide-up-delay-3">
            <button
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#ffffff] text-[#000000] font-black text-base shadow-xl hover:bg-[#e0e0e0] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>Start Chatting Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleLoginClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-[#ffffff] font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 hover:border-[#444444]"
            >
              <span>Sign In to Account</span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#666666] animate-slide-up-delay-3">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00cc66]" />
              <span>Works on Phone & Desktop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00cc66]" />
              <span>Zero App Store Downloads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00cc66]" />
              <span>WebRTC Peer-to-Peer</span>
            </div>
          </div>
        </div>

        {/* 3. HERO SHOWCASE: REAL SPEAKIFY UI SCREENSHOT (BLURRED PRIVACY) */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto animate-slide-up-delay-3">
          <div className="relative rounded-3xl bg-[#0a0a0a] border border-[#222222] shadow-2xl overflow-hidden p-2 sm:p-4 group">
            
            {/* Browser Top Window Bar */}
            <div className="px-4 py-3 bg-[#111111] rounded-2xl border border-[#222222] flex items-center justify-between mb-3 text-xs text-[#666666]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-[#a0a0a0] hidden sm:inline">https://speakify.kanishk.online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#00cc66] font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#00cc66] animate-pulse" />
                  Live WebRTC Relay Active
                </span>
              </div>
            </div>

            {/* Real Screenshot Preview Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-[#000000] border border-[#1a1a1a] shadow-inner flex justify-center items-center">
              <img
                src="/app-ui/speakify-full-ui-blurred.png"
                alt="Speakify Real Interface UI"
                className="w-full h-auto object-contain rounded-xl hover:scale-[1.005] transition-transform duration-500"
                loading="eager"
              />

              {/* Floating Quick Action Overlay on Screenshot */}
              <div className="absolute bottom-5 right-5 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-[#0a0a0a]/95 border border-[#222222] shadow-2xl backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-[#00cc66]/20 text-[#00cc66] flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#ffffff]">HD Voice & Video Active</p>
                  <p className="text-[10px] text-[#666666]">STUN/TURN Relay Server Connected</p>
                </div>
                <button
                  onClick={handleRegisterClick}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-[#ffffff] text-[#000000] font-bold text-xs hover:bg-[#e0e0e0]"
                >
                  Join Room
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. REAL SPEAKIFY CHAT & UI GALLERY SECTION */}
      <section id="real-ui" className="py-24 border-y border-[#222222] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-[#00cc66] text-xs font-bold uppercase tracking-wider">
              Real Speakify Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#ffffff] tracking-tight">
              Genuine chat area & workspace
            </h2>
            <p className="text-[#a0a0a0] text-base">
              Explore the real Speakify UI layout. Switch between the full multi-panel workspace
              and the focused in-chat messaging and document sharing view.
            </p>

            {/* View Switcher Tabs */}
            <div className="flex justify-center gap-3 pt-6">
              <button
                onClick={() => setActiveUiTab('full')}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeUiTab === 'full'
                    ? 'bg-[#ffffff] text-[#000000] shadow-md scale-105'
                    : 'bg-[#111111] text-[#a0a0a0] hover:text-[#ffffff] border border-[#222222]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Full Workspace & Navigation</span>
              </button>

              <button
                onClick={() => setActiveUiTab('chat')}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeUiTab === 'chat'
                    ? 'bg-[#ffffff] text-[#000000] shadow-md scale-105'
                    : 'bg-[#111111] text-[#a0a0a0] hover:text-[#ffffff] border border-[#222222]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Area & File Sharing</span>
              </button>
            </div>
          </div>

          {/* Dynamic Screenshot Card */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-[#0a0a0a] border border-[#222222] p-4 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Image Side */}
              <div className="lg:col-span-8 flex justify-center bg-[#000000] rounded-2xl p-2 border border-[#1a1a1a] overflow-hidden">
                <img
                  src={activeUiTab === 'full' ? '/app-ui/speakify-full-ui-blurred.png' : '/app-ui/speakify-chat-area.png'}
                  alt={activeUiTab === 'full' ? 'Speakify Full Web Workspace' : 'Speakify Real Chat Area with PDF Files'}
                  className="w-full h-auto max-h-[550px] object-contain rounded-xl shadow-lg transition-all duration-300"
                />
              </div>

              {/* Detail Side */}
              <div className="lg:col-span-4 space-y-6">
                <span className="px-3 py-1 rounded-lg bg-[#111111] border border-[#222222] text-[#00cc66] text-xs font-bold uppercase">
                  {activeUiTab === 'full' ? 'Multi-Panel Workspace' : 'Focused Chat Feed'}
                </span>

                <h3 className="text-2xl font-bold text-[#ffffff] leading-tight">
                  {activeUiTab === 'full' 
                    ? 'Sidebar Navigation & Instant Calling'
                    : 'Message Bubbles, Documents & Date Dividers'}
                </h3>

                <p className="text-[#a0a0a0] text-sm leading-relaxed">
                  {activeUiTab === 'full'
                    ? 'Seamlessly switch between direct chats, friend requests, and group channels. One-click voice or video call initiation right from the room header.'
                    : 'Clean dark chat bubbles with timestamps, inline PDF file previews, scroll-to-new-message buttons, and instant media attachments.'}
                </p>

                <div className="space-y-3 pt-2 text-xs text-[#888888]">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00cc66]" />
                    <span>Real-time WebSocket event dispatching</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00cc66]" />
                    <span>One-click audio and video calling</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00cc66]" />
                    <span>JWT token authentication and sessions</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleRegisterClick}
                    className="w-full py-3.5 rounded-xl bg-[#ffffff] text-[#000000] font-bold text-sm hover:bg-[#e0e0e0] flex items-center justify-center gap-2"
                  >
                    <span>Try It on speakify.kanishk.online</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. CORE FEATURES — Pitch-Dark Aesthetics */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">
            Web-First Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#ffffff] tracking-tight">
            Built for modern real-time communication
          </h2>
          <p className="text-[#a0a0a0] text-base sm:text-lg">
            Everything works directly in your web browser. No plugins, no installers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-[#00cc66]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">WebRTC HD Audio Calling</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Ultra-low latency audio calling powered by metered STUN/TURN relays with background noise filtering.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-[#00cc66]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">1-on-1 Video Calling</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Direct peer-to-peer 60fps video calling with auto bitrate adaptation based on your bandwidth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-[#ffffff]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">Rooms & Community Groups</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Create customized group rooms, search members by username, and send instant friend requests.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-[#ffffff]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">Real-Time Messaging</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Real-time messaging via Socket.IO with typing indicators, date separators, and delivery receipts.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-[#00cc66]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">Document & PDF Sharing</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Send PDF files, docs, and images up to 50MB directly in the chat with clean inline preview cards.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-3xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#ffffff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-[#ffffff]" />
            </div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">Accessible from Any Device</h3>
            <p className="text-[#888888] text-sm leading-relaxed">
              Launch directly on Chrome, Safari, Edge, or Firefox. Works equally well on mobile phones and desktop computers.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 bg-[#050505] border-y border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#00cc66] text-xs font-bold uppercase tracking-wider">Fast Setup</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ffffff]">Start in 3 easy steps</h2>
            <p className="text-[#888888] text-sm">No verification codes or downloads required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] text-[#000000] font-black text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="text-xl font-bold text-[#ffffff]">Create Free Account</h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                Choose your username and password on <span className="text-[#ffffff]">speakify.kanishk.online/register</span>. Takes only 15 seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] text-[#000000] font-black text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="text-xl font-bold text-[#ffffff]">Find Friends & Groups</h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                Use the search tab to look up friends by username, accept friend requests, or create private group rooms.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] text-[#000000] font-black text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="text-xl font-bold text-[#ffffff]">Call & Chat in Browser</h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                Hit the voice or video button inside any conversation to start an instant WebRTC call with no latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY TESTIMONIALS */}
      <section id="community" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[#00cc66] text-xs font-bold uppercase tracking-wider">Minimal & Fast</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ffffff]">Built for people who value speed</h2>
          <p className="text-[#888888] text-sm sm:text-base">No bloated ads. Just pure, immediate communication.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[#b3b3b3] text-sm leading-relaxed italic">
                "The web video calling works instantly. I don't need to ask my friends to install any app — I just send them the link and we're talking."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#1c1c1c]">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f] text-[#ffffff] font-bold flex items-center justify-center text-xs">
                K
              </div>
              <div>
                <p className="font-bold text-[#ffffff] text-xs">Kanishk S.</p>
                <p className="text-[11px] text-[#666666]">Developer</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[#b3b3b3] text-sm leading-relaxed italic">
                "The pitch black UI is gorgeous. It looks like a high-end terminal and uses practically zero battery compared to heavy desktop apps."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#1c1c1c]">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f] text-[#ffffff] font-bold flex items-center justify-center text-xs">
                R
              </div>
              <div>
                <p className="font-bold text-[#ffffff] text-xs">Rohan M.</p>
                <p className="text-[11px] text-[#666666]">Product Designer</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[#b3b3b3] text-sm leading-relaxed italic">
                "Audio quality is exceptionally clear. The WebRTC connection establishes in milliseconds even on standard mobile 4G/5G connections."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#1c1c1c]">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f] text-[#ffffff] font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div>
                <p className="font-bold text-[#ffffff] text-xs">Ananya V.</p>
                <p className="text-[11px] text-[#666666]">Community Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL WEB CALL TO ACTION BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0a0a0a] border border-[#222222] p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] text-[#00cc66] text-xs font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00cc66] animate-ping" />
            Direct In-Browser Access
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#ffffff] tracking-tight">
            Ready to experience Speakify?
          </h2>

          <p className="text-[#a0a0a0] text-base max-w-xl mx-auto">
            Create your account in seconds and join the conversation.
            Works instantly in your browser at <span className="text-[#ffffff] font-semibold">speakify.kanishk.online</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#ffffff] text-[#000000] font-black text-base hover:bg-[#e0e0e0] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLoginClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-[#ffffff] font-semibold text-base transition-all"
            >
              <span>Sign In to Web App</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER — Pitch Black Minimalist */}
      <footer className="border-t border-[#1a1a1a] bg-[#000000] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#161616]">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#000000] flex items-center justify-center font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold text-[#ffffff]">Speakify</span>
              <span className="text-xs text-[#666666]">· speakify.kanishk.online</span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#888888]">
              <button onClick={() => scrollToSection('features')} className="hover:text-[#ffffff] transition-colors">Features</button>
              <button onClick={() => scrollToSection('real-ui')} className="hover:text-[#ffffff] transition-colors">Chat UI</button>
              <button onClick={handleLoginClick} className="hover:text-[#ffffff] transition-colors">Sign In</button>
              <button onClick={handleRegisterClick} className="hover:text-[#ffffff] transition-colors">Register</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
            <p>© {new Date().getFullYear()} Speakify. Real-time web communication.</p>
            <div className="flex items-center gap-2 text-[#00cc66]">
              <Shield className="w-3.5 h-3.5" />
              <span>WebRTC End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;