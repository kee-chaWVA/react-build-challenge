import { useState } from 'react'
import type { Quote } from '../types/quote'
import { quotes as initialQuotes } from '../data/quotes'
import Button from '../components/Button'
import Card from '../components/Card'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [activeQuote, seetActiveQuote] = useState<Quote | null>(null)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState<string>('')

  const showRandomQuote = () => {
    if(!quotes.length)return;
    const randomIndex = Math.floor(Math.random() * quotes.length)
    seetActiveQuote(quotes[randomIndex])
  }

  const addNewQuotes = () => {
    if(!newQuote.trim()) return;
    const quote: Quote = {
      id: initialQuotes.length + 1,
      quote: newQuote
    };
    setQuotes((prev) =>[quote, ...prev]);
    seetActiveQuote(quote)
    setNewQuote('')
    setShowInput(false)
  }


  return (
    <div>
      <div>
        <Button onClick={showRandomQuote}>Show Quote of the Day</Button>
        <Button onClick={()=>setShowInput(true)}>Add Quotes</Button>
      </div>
      {showInput && (
        <div>
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
          />
          <Button onClick={addNewQuotes}>Save</Button>
        </div>
      )}
      {activeQuote ?
        <Card>{activeQuote.quote}</Card>
        :
        <p>
          No quotes yet. Add one to get started!
        </p>
      }
    </div>
  )
}