import { useFormContext } from 'react-hook-form';
import { Field } from '../chat-list/ChatList';
import './form.css';

interface FormProps {
  fields: Field[];
  title: string;
}

export const Form: React.FC<FormProps> = ({ fields, title }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <form>
      <h3 className="form-title">{title}</h3>
      {fields.map((field: Field) => (
        <div key={field.name} className="form-container ">
          <input
            className={`form-input ${errors[field.name] ? 'error' : ''}`}
            type={field.type}
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name, {
              required: field.required,
              pattern: field.errorRegex,
            })}
          />
          {errors[field.name] && (
            <span
              className={`form-error ${errors[field.name] ? 'visible' : ''}`}
            >
              {field.errorText}
            </span>
          )}
        </div>
      ))}
    </form>
  );
};
