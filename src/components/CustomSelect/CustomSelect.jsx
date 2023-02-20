import Select from 'react-select';

export function CustomSelect({ onChange, options, value, type, isLoading }) {
  const defaultValue = (options, value) => {
    if (value === '') {
      return true;
    }
    return options ? options.find(option => option.value === value) : '';
  };

  return (
    <>
      <Select
        closeMenuOnSelect={true}
        classNamePrefix="custom-select"
        value={defaultValue(options, value)}
        onChange={value => onChange(value)}
        options={options}
        placeholder={type}
        isLoading={isLoading}
        required
      />
    </>
  );
}
