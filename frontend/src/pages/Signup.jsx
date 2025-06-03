import { useState } from 'react'
import { use_auth_store } from '../store/use_auth_store'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Authimg from '../components/Authimg'

const Signup = () => {
  const [show_password, set_show_password] = useState(false)
  const [form_data, set_form_data] = useState({
    user_name: '',
    email: '',
    password: ''
  })

  const { signup, is_signing_up } = use_auth_store()

  const validate_form = () => {
    if (!form_data.user_name.trim()) return toast.error('Full name is required')
    if (!form_data.email.trim()) return toast.error('Email is required')
    if (!/\S+@\S+\.\S+/.test(form_data.email)) return toast.error('Invalid email format')
    if (!form_data.password) return toast.error('Password is required')
    if (form_data.password.length < 6) return toast.error('Password must be at least 6 characters')

    return true
  }

  const handle_submit = (e) => {
    e.preventDefault()
    const success = validate_form()
    if (success === true) signup(form_data)
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary'/>
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create account</h1>
              <p className='text-base-content/60'>Get started with your free account.</p>
            </div>
          </div>

          <form onSubmit={handle_submit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Username</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none'>
                  <User className='text-base-content/40 size-5' />
                </div>
                <input 
                  type='text'
                  className='input input-bordered w-full pl-10'
                  placeholder='John Doe'
                  value={form_data.user_name}
                  onChange={(e) => set_form_data((data) => ({ ...data, user_name: e.target.value }))}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40'/>
                </div>
                <input
                  type='email'
                  className='input input-bordered w-full pl-10'
                  placeholder='you@example.com'
                  value={form_data.email}
                  onChange={(e) => set_form_data({ ...form_data, email: e.target.value })}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content/40'/>
                </div>
                <input
                  type={show_password ? 'text' : 'password'}
                  className='input input-bordered w-full pl-10'
                  placeholder='••••••••'
                  value={form_data.password}
                  onChange={(e) => set_form_data({ ...form_data, password: e.target.value })}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => set_show_password(!show_password)}
                >
                  {show_password ? <EyeOff className='size-5 text-base-content/40'/> : <Eye className='size-5 text-base-content/40'/>}
                </button>
              </div>
            </div>

            <button type='submit' className='btn btn-primary w-full' disabled={is_signing_up}>
              {is_signing_up ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account? <Link to='/login' className='link link-primary'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <Authimg title='Join our community' subtitle='Share moment, connect with your loved ones.'/>
    </div>
  )
}

export default Signup
