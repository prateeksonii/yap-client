import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignIn() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: {
    email: string
    password: string
  }) => {
    const response = await fetch(
      'http://localhost:8000/api/v1/users/signin',
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (!response.ok) {
      toast.error(
        'Unable to sign in, please try again later.',
      )
    }

    localStorage.setItem(
      'yap_token',
      response.headers.get('Authorization')?.split(
        'Bearer ',
      )[1] || '',
    )

    await router.navigate({
      replace: true,
      to: '/app',
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email
            </Label>
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
              {errors.email && (
                <span>
                  {errors.email
                    .message}
                </span>
              )}
            </p>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register(
                'password',
                {
                  required: 'Password is required',
                },
              )}
            />
            <p className="text-red-400 text-sm">
              {errors.password && (
                <span>
                  {errors.password
                    .message}
                </span>
              )}
            </p>
          </div>
          <Button type="submit" className="mt-2">Sign in</Button>
        </form>
      </CardContent>
    </Card>
  )
}
