import { useState } from 'react'
import type { Quote } from '../types/quote'
import Button from '../components/Button'
import Card from '../components/Card'
import '../styles/QuotesPage.css'
import type { SubmitEvent } from 'react'
import IconButton from "@mui/material/IconButton";
import type { QuotesResponse } from '../types/api/QuotesResponse'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthContext'
import FlashMessage from '../components/FlashMessage';
import { api } from '../api/client'
import { getQuotes, addQuote } from '../data/quotesDb'

export default function QuotesPage() {
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState<string>('')
  const [error, setError] = useState<string>('')
  const {user} = useAuth()
  const queryClient = useQueryClient();

  const {data: quotes = []} = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => getQuotes(),
  })

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

  const mutation = useMutation<QuotesResponse, Error, string>({
    mutationFn: async (quoteText) => {
      const res = await api.post<QuotesResponse>(
         "https://jsonplaceholder.typicode.com/posts",
         {
          body: quoteText,
          userId: user?.id
        }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      const newQuote = {
        id: data.id,
        quote: data.body
      };  
      await addQuote(newQuote);

      queryClient.invalidateQueries({
        queryKey: ["quotes"]
      });

      setActiveQuote(newQuote);
      setNewQuote('');
      setShowInput(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  })

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    if(!newQuote.trim()) return;
    mutation.mutate(newQuote.trim());
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
        {error && (
          <FlashMessage
            message={error}
            autoHideDuration={3000}
            onClose={() => setError("")}
            className="flash-overlay"
          />
        )}
      </header>
      <section className="quotes-actions">
        <Button onClick={showRandomQuote} disabled={showInput}>Show Quote of the Day</Button>
        <Button variant='secondary' onClick={() => setShowInput(true)} disabled={!!activeQuote}>Add a Quote</Button>
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