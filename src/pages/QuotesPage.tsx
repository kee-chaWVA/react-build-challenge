import { useState } from 'react'
import type { Quote } from '../types/quote'
import { quotes as initialQuotes } from '../data/quotes'
import Button from '../components/Button'
import Card from '../components/Card'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState<string>('')

  const showRandomQuote = () => {
    if(!quotes.length)return;
    
    if (quotes.length === 1) {
      setActiveQuote(quotes[0])
      return
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setActiveQuote(quotes[randomIndex])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(!newQuote.trim()) return;
    const quote: Quote = {
      id: quotes.length ? Math.max(...quotes.map(q => q.id)) + 1 : 1,
      quote: newQuote.trim()
    };
    setQuotes((prev) =>[quote, ...prev]);
    setActiveQuote(quote)
    setNewQuote('')
    setShowInput(false)
  }

  return (
    <main aria-labelledby="quotes-heading">
      <header>
        <h1 id="quotes-heading">Quotes</h1>
      </header>
      <section>
        <Button onClick={showRandomQuote}>Show Quote of the Day</Button>
        <Button onClick={()=>setShowInput(true)}>Add a Quote</Button>
      </section>
      {showInput && (
        <section>
        <form
          onSubmit={handleSubmit}
        >
          <label htmlFor="quote-input" className='visually-hidden'>New quote</label>
          <input
            id="quote-input"
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            autoFocus
          />
          <Button type="submit">Save</Button>
        </form>
        </section>
      )}
      {activeQuote ?
        <Card>
          <blockquote>
            <p>{activeQuote.quote}</p>
          </blockquote>
        </Card> 
        :
        <p role="status">
          No quotes yet. Add one to get started!
        </p>
      }
    </main>
  )
}