import { forwardRef } from "react";

const FormInput = forwardRef(({ label, error, ...props }, ref) => (
	<div className="mb-4">
		{label && (
			<label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
				{label}
				{props.required && <span className="text-red-500">*</span>}
			</label>
		)}
		<input ref={ref} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#037764] text-black bg-white ${error ? "border-red-500" : "border-black"}`} {...props} />
		{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
	</div>
));

FormInput.displayName = "FormInput";

export default FormInput;
