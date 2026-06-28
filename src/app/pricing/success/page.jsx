import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react' // Optional: Install lucide-react for clean icons
import { stripe } from '@/lib/stripe'


export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    return (
      <main className="min-h-screen bg-[#121212] flex items-center justify-center p-4 antialiased selection:bg-zinc-700">
        {/* Glassmorphic Container */}
        <div className="w-full max-w-md bg-[#1c1c1c]/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 shadow-2xl text-center">
          
          {/* Animated Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 animate-fade-in">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
            Payment Successful
          </h1>
          <p className="text-sm text-zinc-400 mb-8">
            Thank you for your order! Your transaction completed successfully.
          </p>

          {/* Details Card */}
          <div className="bg-[#262626]/40 border border-zinc-800/50 rounded-xl p-5 text-left space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Confirmation Email</p>
                <p className="text-sm text-zinc-300 font-mono break-all mt-0.5">{customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
            Have questions or issues? Feel free to reach out to{' '}
            <a 
              href="mailto:orders@example.com" 
              className="text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-500"
            >
              orders@example.com
            </a>
          </p>

          {/* Action Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-sm transition-all shadow-lg hover:shadow-zinc-950/20 group"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
        </div>
      </main>
    )
  }
}