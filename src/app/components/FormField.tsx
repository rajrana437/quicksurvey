interface FormFieldProps {
    label: string;
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
  }
  
  const FormField = ({ label, id, type, value, onChange, placeholder, required }: FormFieldProps) => {
    return (
      <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value} // This will be controlled by the formData state
          onChange={onChange} // This updates the formData state
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  };
  
  export default FormField;
  