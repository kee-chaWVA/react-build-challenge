import { useState } from 'react'
import type { Quote } from '../types/quote'
import { quotes as initialQuotes } from '../data/quotes'
import Button from '../components/Button'
import Card from '../components/Card'
import '../styles/QuotesPage.css'
import type { SubmitEvent } from 'react'
import IconButton from "@mui/material/IconButton";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState<string>('')

  const showRandomQuote = () => {
    if(!quotes.length)return;
    setShowInput(false)
    if (quotes.length === 1) {
      setActiveQuote(quotes[0])
      return
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setActiveQuote(quotes[randomIndex])
  }

  const handleSubmit = (e: SubmitEvent) => {
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

  const onClose = () => {
    setActiveQuote(null)
    setShowInput(false)
    setNewQuote('')
  }

  return (
    <main aria-labelledby="quotes-heading" className='quotes-page'>
      <header className='quotes-header'>
        <h1 id="quotes-heading">Quotes</h1>
      </header>
      <section className="quotes-actions">
        <Button onClick={showRandomQuote} disabled={showInput}>Show Quote of the Day</Button>
        <Button variant='secondary' onClick={() => setShowInput(true)} disabled={activeQuote}>Add a Quote</Button>
      </section>
      {showInput && (
        <section>
          <form className="add-quote-form"
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
            <Button type='button' onClick={onClose}>Cancel</Button>
          </form>
        </section>
      )}
      {activeQuote ? 
        <Card className="quote-card">
          <IconButton
            onClick={onClose}
            className="random-quotes-close"
            aria-label="Close quote"
          >
            &times;
          </IconButton>

          <blockquote>
            <p>{activeQuote.quote}</p>
          </blockquote>
        </Card> 
        :
        <p role="status" className="quote-empty">
          No quotes yet. Add one to get started!
        </p>
      }
    </main>
  )
}