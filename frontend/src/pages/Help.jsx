import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'Order kaise place karun?',
    a: 'Restaurant chuno, dishes cart mein add karo, Checkout par address chuno aur Place Order dabao.',
  },
  {
    q: 'Order cancel kaise karun?',
    a: 'My Orders mein jao. Jab tak order PLACED hai, Cancel button dikhega. Restaurant accept kar le to cancel nahi hota.',
  },
  {
    q: 'Delivery mein kitna time lagta hai?',
    a: 'Aam taur par 30-40 minute. Order ka live status My Orders mein dikhta hai.',
  },
  {
    q: 'Payment kaise karun?',
    a: 'Abhi Cash on Delivery available hai. UPI, Card aur Net Banking jaldi aa rahe hain.',
  },
  {
    q: 'Galat address daal diya, kya karun?',
    a: 'Order place hone se pehle Checkout mein Change dabakar address badal sakte ho. Profile mein Saved Addresses se bhi manage kar sakte ho.',
  },
]

const ROW = 'w-full flex items-center gap-3 px-4 py-4 text-left text-sm border-b last:border-b-0'

export default function Help() {
  const [open, setOpen] = useState(null)
  const [section, setSection] = useState('')
  const [message, setMessage] = useState('')
  const [issue, setIssue] = useState('')
  const [sent, setSent] = useState(false)

  const toggle = (name) => {
    setSection(section === name ? '' : name)
    setMessage('')
    setSent(false)
  }

  const submitIssue = (e) => {
    e.preventDefault()
    setSent(true)
    setIssue('')
  }

  return (
    <div className="max-w-md mx-auto pb-6">
      <Link to="/profile" className="text-sm text-orange-600">← Back</Link>
      <h1 className="font-display text-2xl font-bold text-orange-600 mb-4">Help & Support</h1>

      {message && <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-3 text-sm">{message}</p>}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button className={ROW} onClick={() => toggle('faq')}>
          <span>❓</span>
          <span className="flex-1">
            <b className="block">FAQs</b>
            <span className="text-xs text-gray-500">Aam sawalon ke jawab</span>
          </span>
          <span>{section === 'faq' ? '⌃' : '›'}</span>
        </button>
        {section === 'faq' && (
          <div className="px-4 pb-3 border-b">
            {FAQS.map((f, i) => (
              <div key={f.q} className="border-b last:border-b-0 py-2">
                <button className="w-full text-left text-sm font-medium flex justify-between gap-2"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span>{f.q}</span><span>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="text-sm text-gray-600 mt-1">{f.a}</p>}
              </div>
            ))}
          </div>
        )}

        <button className={ROW} onClick={() => toggle('contact')}>
          <span>📞</span>
          <span className="flex-1">
            <b className="block">Contact Us</b>
            <span className="text-xs text-gray-500">Hamari team se baat karo</span>
          </span>
          <span>{section === 'contact' ? '⌃' : '›'}</span>
        </button>
        {section === 'contact' && (
          <div className="px-4 pb-4 text-sm text-gray-700 space-y-1 border-b">
            <p>📧 support@goodplate.example</p>
            <p>📱 +91 90000 00000</p>
            <p className="text-xs text-gray-400">Subah 10 se raat 10 baje tak</p>
          </div>
        )}

        <button className={ROW}
          onClick={() => { setSection(''); setMessage('Live Chat jaldi aa raha hai.') }}>
          <span>💬</span>
          <span className="flex-1">
            <b className="block">Live Chat</b>
            <span className="text-xs text-gray-500">Turant chat karo</span>
          </span>
          <span>›</span>
        </button>

        <button className={ROW} onClick={() => toggle('issue')}>
          <span>⚠️</span>
          <span className="flex-1">
            <b className="block">Report an Issue</b>
            <span className="text-xs text-gray-500">Kuch galat ho to batao</span>
          </span>
          <span>{section === 'issue' ? '⌃' : '›'}</span>
        </button>
        {section === 'issue' && (
          <form onSubmit={submitIssue} className="px-4 pb-4 space-y-2">
            {sent && (
              <p className="bg-green-100 text-green-800 p-2 rounded text-sm">
                Aapki shikayat mil gayi. Shukriya!
              </p>
            )}
            <textarea required rows={4} value={issue} onChange={(e) => setIssue(e.target.value)}
              placeholder="Kya problem aayi?"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-sm" />
            <button className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm">Submit</button>
          </form>
        )}
      </div>
    </div>
  )
}