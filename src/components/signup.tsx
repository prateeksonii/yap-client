import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignUp({
  setCurrentTab,
}: {
  setCurrentTab: (tab: 'signin' | 'signup') => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  })

  const onSubmit = async (data: {
    name: string
    email: string
    password: string
  }) => {
    try {
      await axios.post('/users/signup', data)

      setCurrentTab('signin')
    }
    catch {
      toast.error('Unable to sign up, please try again later.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
            />
            <p className="text-red-400 text-sm">
              {errors.name && <span>{errors.name.message}</span>}
            </p>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                pattern: {
                  message: 'Invalid email address',
                  value: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                },
                required: 'Email is required',
              })}
            />
            <p className="text-red-400 text-sm">
              {errors.email && <span>{errors.email.message}</span>}
            </p>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', {
                minLength: {
                  message: 'Password must be at least 6 characters long',
                  value: 6,
                },
                required: 'Password is required',
              })}
            />
            <p className="text-red-400 text-sm">
              {errors.password && <span>{errors.password.message}</span>}
            </p>
          </div>
          <Button>Sign up</Button>
        </form>
      </CardContent>
    </Card>
  )
}
