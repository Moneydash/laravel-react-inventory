<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => ['required', 'email', 'max:255', Rule::unique('leads')->ignore($this->route('lead_id'))],
            'contact_num' => 'required',
            'lead_owner' => 'required',
            'lead_source_id' => 'required',
            'company_name' => 'nullable',
            'industry_type_id' => 'required',
            'job_title_id' => 'required',
            'lead_status' => 'required',
            'notes' => 'nullable',
            'website' => 'nullable',
            'interests' => 'nullable',
            'campaign' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'firstname.required' => 'First name is required.',
            'lastname.required' => 'Last name is required.',
            'email.required' => 'E-mail is required.',
            'email.unique' => 'This e-mail is already registered.',
            'email.email' => 'Please enter a valid e-mail address.',
            'contact_num.required' => 'Mobile Number is required.',
            'lead_owner.required' => 'Organization name is required.',
            'lead_source_id.required' => 'Source of the Lead is required.',
            'industry_type_id.required' => 'Type of Industry is required.',
            'job_title_id.required' => 'Job Title is required.',
            'lead_status' => 'Lead Status is required.'
        ];
    }
}
