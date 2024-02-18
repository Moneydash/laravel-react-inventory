@component('mail::message')
# User Registration Mail

<h2>Welcome {{ $user['username'] }}</h2>


@component('mail::panel')
You're account has been successfully created!
@endcomponent

<p>Here is your account credentials.</p>

@component('mail::table')
| Email                   | Password                   | Role                                    |
| -------------------------- |:-------------------------:| :---------------------------------------: |
| {{ $user['email'] }}      | {{ $user['password'] }}    | {{ $user['role'] }}      |
@endcomponent

<p>Thank you for Signing Up</p>

@component('mail::button', [ 'url' => $url ])
Login to your Account...
@endcomponent


Regards,<br />
{{ config('app.name') }}
    
@endcomponent