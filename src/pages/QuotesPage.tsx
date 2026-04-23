import { useState } from 'react'
import type { Quote } from '../types/quote'
import { quotes as initialQuotes } from '../data/quotes'
import Button from '../components/Button'
import Card from '../components/Card'
import List from '../components/List'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState<string>('')

  const shuffleQuotes = () => {
    const shuffle = [...quotes].sort(() => Math.random() - 0.5)
    setQuotes(shuffle);
  }

  const addNewQuotes = () => {
    if(!newQuote.trim()) return;
    const quote: Quote = {
      id: initialQuotes.length + 1,
      quote: newQuote
    };
    setQuotes((prev) =>[quote, ...prev]);
    setNewQuote('')
    setShowInput(false)
  }


  return (
    <div>
      <div>
        <Button onClick={shuffleQuotes}>Shuffle</Button>
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
      <List<Quote> items={quotes} renderItem={(quote) => (
        <li key={quote.id}>
          <Card>
            {quote.quote}
          </Card>
        </li>
      )}/>
    </div>
  )
}