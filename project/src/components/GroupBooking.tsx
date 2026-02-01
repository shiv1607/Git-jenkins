import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Mail, Phone, User } from 'lucide-react';

interface GroupMember {
  memberName: string;
  memberEmail: string;
  memberPhone: string;
}

interface GroupBookingProps {
  programId: number;
  programTitle: string;
  ticketPrice: number;
  onBookingComplete: (booking: any) => void;
  onClose: () => void;
}

export default function GroupBooking({ programId, programTitle, ticketPrice, onBookingComplete, onClose }: GroupBookingProps) {
  const [isGroupBooking, setIsGroupBooking] = useState(false);
  const [groupSize, setGroupSize] = useState(1);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { memberName: '', memberEmail: '', memberPhone: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGroupSizeChange = (newSize: number) => {
    if (newSize >= 1 && newSize <= 4) {
      setGroupSize(newSize);
      
      // Adjust group members array
      if (newSize > groupMembers.length) {
        // Add new members
        const newMembers = [...groupMembers];
        for (let i = groupMembers.length; i < newSize; i++) {
          newMembers.push({ memberName: '', memberEmail: '', memberPhone: '' });
        }
        setGroupMembers(newMembers);
      } else if (newSize < groupMembers.length) {
        // Remove extra members
        setGroupMembers(groupMembers.slice(0, newSize));
      }
    }
  };

  const updateGroupMember = (index: number, field: keyof GroupMember, value: string) => {
    const updatedMembers = [...groupMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setGroupMembers(updatedMembers);
  };

  const validateForm = () => {
    if (isGroupBooking) {
      // Check if all group members have names
      for (let i = 0; i < groupMembers.length; i++) {
        if (!groupMembers[i].memberName.trim()) {
          setError(`Please enter name for member ${i + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Get student ID from localStorage or context
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        setError('Please login to book programs');
        return;
      }

      const bookingData = {
        studentId: parseInt(studentId),
        programId: programId,
        razorpayPaymentId: null, // Will be set after payment
        isGroupBooking: isGroupBooking,
        groupSize: groupSize,
        groupMembers: isGroupBooking ? groupMembers : []
      };

      const response = await fetch('http://localhost:3048/api/program-bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const booking = await response.json();
        onBookingComplete(booking);
      } else {
        const errorData = await response.text();
        setError(errorData);
      }
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book Program</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{programTitle}</h3>
          <p className="text-gray-600">Price per person: ₹{ticketPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Type Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsGroupBooking(false)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                !isGroupBooking
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Individual</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsGroupBooking(true)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                isGroupBooking
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Group</span>
            </button>
          </div>

          {/* Group Size Selector */}
          {isGroupBooking && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Group Size (1-4 members)
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleGroupSizeChange(groupSize - 1)}
                  disabled={groupSize <= 1}
                  className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
                
                <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                  {groupSize}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleGroupSizeChange(groupSize + 1)}
                  disabled={groupSize >= 4}
                  className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Group Members Form */}
          {isGroupBooking && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Group Members</h4>
              {groupMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-medium text-gray-700 mb-3">Member {index + 1}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name *</label>
                      <input
                        type="text"
                        value={member.memberName}
                        onChange={(e) => updateGroupMember(index, 'memberName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={member.memberEmail}
                        onChange={(e) => updateGroupMember(index, 'memberEmail', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={member.memberPhone}
                        onChange={(e) => updateGroupMember(index, 'memberPhone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Amount */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Ticket Price:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{ticketPrice}
              </span>
            </div>
            {isGroupBooking && (
              <p className="text-sm text-gray-600 mt-1">
                Base price per person (group booking)
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 