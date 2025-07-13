'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import FormInput from '@/components/FormInput';
import { useAuth } from '@/contexts/AuthContext';

const SECTORS = [
  { id: 'creche', label: 'Creche' },
  { id: 'kindergarten', label: 'Kindergarten' },
  { id: 'nursery', label: 'Nursery' },
  { id: 'primary', label: 'Primary' },
  { id: 'junior_high', label: 'Junior High' },
  { id: 'senior_high', label: 'Senior High' }
];

function EditProfileContent() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    schoolName: '',
    yearCreated: '',
    address: '',
    adminFirstName: '',
    adminLastName: '',
    adminPhone: '',
    adminEmail: '',
    sectors: [],
    numberOfTeachers: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Load existing data (in a real app, this would come from the database)
  useEffect(() => {
    // Simulate loading existing institution data
    const existingData = {
      schoolName: 'Demo School',
      yearCreated: '2010',
      address: '123 Education Street, Learning City',
      adminFirstName: user?.name?.split(' ')[0] || '',
      adminLastName: user?.name?.split(' ')[1] || '',
      adminPhone: '+1 (555) 123-4567',
      adminEmail: user?.email || '',
      sectors: ['primary', 'junior_high'],
      numberOfTeachers: '25'
    };
    
    setFormData(existingData);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSectorChange = (sectorId) => {
    setFormData(prev => {
      const sectors = prev.sectors.includes(sectorId)
        ? prev.sectors.filter(id => id !== sectorId)
        : [...prev.sectors, sectorId];
      
      return { ...prev, sectors };
    });
    
    // Clear sectors error when user selects
    if (errors.sectors) {
      setErrors(prev => ({
        ...prev,
        sectors: ''
      }));
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    
    if (!formData.yearCreated) {
      newErrors.yearCreated = 'Year of creation is required';
    } else if (formData.yearCreated < 1800 || formData.yearCreated > currentYear) {
      newErrors.yearCreated = `Year must be between 1800 and ${currentYear}`;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.adminFirstName.trim()) {
      newErrors.adminFirstName = 'Admin first name is required';
    }
    
    if (!formData.adminLastName.trim()) {
      newErrors.adminLastName = 'Admin last name is required';
    }
    
    if (!formData.adminPhone.trim()) {
      newErrors.adminPhone = 'Admin phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.adminPhone)) {
      newErrors.adminPhone = 'Please enter a valid phone number';
    }
    
    if (!formData.adminEmail) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }
    
    if (formData.sectors.length === 0) {
      newErrors.sectors = 'Please select at least one sector';
    }
    
    if (!formData.numberOfTeachers) {
      newErrors.numberOfTeachers = 'Number of teachers is required';
    } else if (formData.numberOfTeachers < 1) {
      newErrors.numberOfTeachers = 'Number of teachers must be at least 1';
    } else if (formData.numberOfTeachers > 10000) {
      newErrors.numberOfTeachers = 'Please enter a reasonable number of teachers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call to update institution data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Updated institution data:', formData);
      setSuccessMessage('Profile updated successfully!');
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Institution Profile</h1>
            <p className="text-blue-100 mt-1">Update your school's information</p>
          </div>
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* School Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">School Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  required
                  label="School Name"
                  placeholder="Enter school name"
                  value={formData.schoolName}
                  onChange={handleChange}
                  error={errors.schoolName}
                />
                
                <FormInput
                  id="yearCreated"
                  name="yearCreated"
                  type="number"
                  required
                  label="Year of Creation"
                  placeholder="e.g., 1995"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.yearCreated}
                  onChange={handleChange}
                  error={errors.yearCreated}
                />
              </div>
              
              <FormInput
                id="address"
                name="address"
                type="text"
                required
                label="School Address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>

            {/* Admin Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="adminFirstName"
                  name="adminFirstName"
                  type="text"
                  required
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.adminFirstName}
                  onChange={handleChange}
                  error={errors.adminFirstName}
                />
                
                <FormInput
                  id="adminLastName"
                  name="adminLastName"
                  type="text"
                  required
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.adminLastName}
                  onChange={handleChange}
                  error={errors.adminLastName}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="adminPhone"
                  name="adminPhone"
                  type="tel"
                  required
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  error={errors.adminPhone}
                />
                
                <FormInput
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  required
                  label="Email Address"
                  placeholder="Enter email address"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={errors.adminEmail}
                />
              </div>
            </div>

            {/* Number of Teachers */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h2>
              
              <FormInput
                id="numberOfTeachers"
                name="numberOfTeachers"
                type="number"
                required
                label="Number of Teachers"
                placeholder="Enter current number of teachers"
                min="1"
                max="10000"
                value={formData.numberOfTeachers}
                onChange={handleChange}
                error={errors.numberOfTeachers}
              />
            </div>

            {/* Sectors Covered */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sectors Covered</h2>
              <p className="text-sm text-gray-600 mb-4">Select all educational levels your institution covers (at least one required)</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTORS.map((sector) => (
                  <label
                    key={sector.id}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.sectors.includes(sector.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.sectors.includes(sector.id)}
                      onChange={() => handleSectorChange(sector.id)}
                    />
                    <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                      formData.sectors.includes(sector.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.sectors.includes(sector.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.sectors.includes(sector.id)
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}>
                      {sector.label}
                    </span>
                  </label>
                ))}
              </div>
              
              {errors.sectors && (
                <p className="mt-2 text-sm text-red-600">{errors.sectors}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating profile...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}