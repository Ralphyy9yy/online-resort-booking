import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

import {
  Home,
  Calendar,
  Users,
  DollarSign,
  Menu,
  Bell,
  MessageSquare,
  LogOut,
  BarChart2,
  BedDouble,
} from "lucide-react";

// MessagesContent component to display messages from DB
const MessagesContent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchMessages = async (page = 1, search = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/messages", {
        params: { page, limit: messagesPerPage, search },
      });
      // Defensive checks for response data shape
      if (
        response.data &&
        Array.isArray(response.data.messages) &&
        typeof response.data.totalPages === "number"
      ) {
        setMessages(response.data.messages);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Invalid data format from server.");
        setMessages([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load messages.");
      setMessages([]);
      setTotalPages(1);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert("Failed to delete message.");
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  };

  // Filter messages client-side additionally (optional)
  const filteredMessages = messages.filter((msg) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (msg.name && msg.name.toLowerCase().includes(q)) ||
      (msg.email && msg.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow max-h-[70vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Manage Messages</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 border rounded w-full"
        value={searchQuery}
        onChange={(e) => {
          setCurrentPage(1);
          setSearchQuery(e.target.value);
        }}
        aria-label="Search messages by name or email"
      />

      {/* Loading */}
      {loading && <p>Loading messages...</p>}

      {/* Error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Empty state */}
      {!loading && filteredMessages.length === 0 && <p>No messages found.</p>}

      {/* Messages list */}
      <ul className="divide-y divide-gray-200">
        {filteredMessages.map(({ id, name, email, message, created_at }) => (
          <li key={id} className="py-3 flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {name || "Unknown"}{" "}
                <span className="text-gray-500 text-sm">
                  ({email || "No email"})
                </span>
              </p>
              <p className="text-gray-700">
                {message || "(No message content)"}
              </p>
              <p className="text-gray-400 text-xs">
                {created_at
                  ? new Date(created_at).toLocaleString()
                  : "Unknown date"}
              </p>
            </div>
            <button
              className="ml-4 text-red-600 hover:underline text-sm"
              onClick={() => handleDelete(id)}
              disabled={deleting === id}
              aria-disabled={deleting === id}
            >
              {deleting === id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || loading}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};



// RoomsContent component to display rooms with type info
const RoomsContent = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [editFields, setEditFields] = useState({
    price: "",
    capacity: "",
    available_rooms: "",
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (error) {
      alert("Failed to load rooms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setEditFields({
      price: room.price?.toString() || "",
      capacity: room.capacity?.toString() || "",
      available_rooms: room.available_rooms?.toString() || "",
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      !editFields.price ||
      !editFields.capacity ||
      !editFields.available_rooms
    ) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${selectedRoom.room_id}`,
        {
          room_type_id: selectedRoom.room_type_id,
          price: parseFloat(editFields.price),
          capacity: parseInt(editFields.capacity, 10),
          available_rooms: parseInt(editFields.available_rooms, 10),
        }
      );
      alert("Room updated successfully!");
      setEditModalOpen(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      alert("Failed to update room");
      console.error(error);
    }
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/rooms/${selectedRoom.room_id}`
      );
      alert("Room deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      alert("Failed to delete room");
      console.error(error);
    }
  };

  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  if (loading) return <p>Loading rooms...</p>;
  if (rooms.length === 0) return <p>No rooms found.</p>;

  return (
    <div className="relative bg-white p-6 rounded-lg shadow max-h-[70vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Room Management</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Room #</th>
            <th className="p-3 border">Room Type</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Capacity</th>
            <th className="p-3 border">Available Rooms</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room_id} className="hover:bg-gray-50">
              <td className="p-3 border">{room.room_id}</td>
              <td className="p-3 border">{room.name || "N/A"}</td>
              <td className="p-3 border">
                ₱
                {Number(room.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="p-3 border">{room.capacity}</td>
              <td className="p-3 border">{room.available_rooms}</td>
              <td className="p-3 border text-center space-x-2">
                <button
                  onClick={() => openEditModal(room)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(room)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
          >
            <h3 className="text-lg font-bold mb-4">
              Edit Room #{selectedRoom.room_id}
            </h3>

            <p className="mb-2">
              <strong>Room Type:</strong> {selectedRoom.name}
            </p>

            <label className="block mb-2">
              Price:
              <input
                type="number"
                name="price"
                value={editFields.price}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 mt-1"
                min="0"
                step="0.01"
                required
              />
            </label>

            <label className="block mb-2">
              Capacity:
              <input
                type="number"
                name="capacity"
                value={editFields.capacity}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 mt-1"
                min="1"
                required
              />
            </label>

            <label className="block mb-4">
              Available Rooms:
              <input
                type="number"
                name="available_rooms"
                value={editFields.available_rooms}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 mt-1"
                min="0"
                required
              />
            </label>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete room #{selectedRoom.room_id} (
              {selectedRoom.name})?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//BookingsContent component
const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const BookingsContent = () => {
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  // Add Room Modal state
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [addRoomBookingId, setAddRoomBookingId] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [addRoomLoading, setAddRoomLoading] = useState(false);

  //extend date state
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openExtendModal = (booking) => {
    setSelectedBooking(booking);
    setNewEndDate("");
    setSubmitError("");
    setExtendModalOpen(true);
  };

  const closeExtendModal = () => {
    setExtendModalOpen(false);
    setSelectedBooking(null);
    setNewEndDate("");
    setSubmitError("");
  };

  const handleExtendSubmit = async () => {
    if (!newEndDate) {
      setSubmitError("Please select a new end date.");
      return;
    }

    const currentEndDate = new Date(selectedBooking.end_date);
    const chosenDate = new Date(newEndDate);

    if (chosenDate <= currentEndDate) {
      setSubmitError("New end date must be after the current end date.");
      return;
    }

    try {
      setSubmitting(true);
      // Replace with your API endpoint for extending booking
      await axios.put(
        `http://localhost:5000/api/bookings/${selectedBooking.booking_id}/extend`,
        { new_end_date: newEndDate }
      );
      // Refresh bookings list here (implement fetchBookings or similar)
      await fetchBookings();
      closeExtendModal();
    } catch (error) {
      setSubmitError("Failed to extend booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  // Fetch bookings and room types on mount
  useEffect(() => {
    fetchBookings();
    fetchRoomTypes();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/bookings");
      setBookings(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roomtypes");
      setRoomTypes(response.data);
      if (response.data.length > 0) {
        setSelectedRoomType(response.data[0].room_type_id);
      }
    } catch (err) {
      console.error("Failed to load room types", err);
      setRoomTypes([]);
    }
  };

  const startEditing = (bookingId, currentStatus) => {
    setEditingBookingId(bookingId);
    setStatusDraft(currentStatus);
  };

  const cancelEditing = () => {
    setEditingBookingId(null);
    setStatusDraft("");
  };

  const saveStatus = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
        status: statusDraft,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status: statusDraft } : b
        )
      );
      cancelEditing();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  const openAddRoomModal = (bookingId) => {
    setAddRoomBookingId(bookingId);
    if (roomTypes.length > 0) {
      setSelectedRoomType(roomTypes[0].room_type_id);
    }
    setRoomQuantity(1);
    setShowAddRoomModal(true);
  };

  const closeAddRoomModal = () => {
    setShowAddRoomModal(false);
    setAddRoomBookingId(null);
    setSelectedRoomType("");
    setRoomQuantity(1);
    setAddRoomLoading(false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!selectedRoomType || roomQuantity < 1) return;
    setAddRoomLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${addRoomBookingId}/add-room`,
        {
          room_type_id: selectedRoomType,
          quantity: roomQuantity,
        }
      );
      await fetchBookings();
      closeAddRoomModal();
    } catch (err) {
      alert("Failed to add room");
      console.error(err);
      setAddRoomLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  // Filter bookings by search and date range
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(booking.booking_id).includes(searchQuery);

    const startDateMatch =
      !dateRange.start || new Date(booking.start_date) >= new Date(dateRange.start);
    const endDateMatch =
      !dateRange.end || new Date(booking.end_date) <= new Date(dateRange.end);

    return matchesSearch && startDateMatch && endDateMatch;
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="p-4 text-gray-600">Loading bookings...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Bookings Management</h2>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by guest or booking ID..."
          className="p-2 border rounded w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            name="start"
            className="p-2 border rounded"
            value={dateRange.start}
            onChange={handleDateChange}
          />
          <input
            type="date"
            name="end"
            className="p-2 border rounded"
            value={dateRange.end}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Booking ID",
              "Guest",
              "Room Types",
              "Dates",
              "Status",
              "Amount",
              "Booked At",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {currentBookings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">
                No bookings found.
              </td>
            </tr>
          ) : (
            currentBookings.map((booking) => (
              <tr
                key={booking.booking_id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  #{booking.booking_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.guest_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.room_types}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.start_date} to {booking.end_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingBookingId === booking.booking_id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        className="block w-full rounded border border-gray-300 bg-white py-1 px-2 text-sm text-gray-700 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                        value={statusDraft}
                        onChange={(e) => setStatusDraft(e.target.value)}
                        autoFocus
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => saveStatus(booking.booking_id)}
                        className="text-green-600 hover:text-green-800 font-semibold px-2 py-1 rounded border border-green-600 hover:bg-green-100"
                        aria-label="Save status"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded border border-red-600 hover:bg-red-100"
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status] || "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ₱{Number(booking.total_price).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.booking_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingBookingId === booking.booking_id ? null : (
                    <>
                      <button
                        onClick={() => startEditing(booking.booking_id, booking.status)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline mr-2"
                        aria-label={`Edit booking ${booking.booking_id} status`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openAddRoomModal(booking.booking_id)}
                        className="text-green-600 hover:text-green-800 focus:outline-none focus:underline mr-2"
                        aria-label={`Add room to booking ${booking.booking_id}`}
                      >
                        Add Room
                      </button>
                      <button
                        onClick={() => openExtendModal(booking)}
                        className="text-purple-600 hover:text-purple-800 focus:outline-none focus:underline"
                        aria-label={`Extend booking ${booking.booking_id} end date`}
                      >
                        Extend
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {Math.ceil(filteredBookings.length / bookingsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage >= Math.ceil(filteredBookings.length / bookingsPerPage)}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>


      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white rounded-lg shadow p-6 w-full max-w-sm"
            onSubmit={handleAddRoom}
          >
            <h3 className="text-lg font-bold mb-4">
              Add Room to Booking #{addRoomBookingId}
            </h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Room Type</label>
              <select
                className="block w-full rounded border border-gray-300 bg-white py-2 px-3 text-gray-700"
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                required
              >
                {roomTypes.map((rt) => (
                  <option key={rt.room_type_id} value={rt.room_type_id}>
                    {rt.room_type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Quantity</label>
              <input
                type="number"
                min={1}
                className="block w-full rounded border border-gray-300 bg-white py-2 px-3 text-gray-700"
                value={roomQuantity}
                onChange={(e) => setRoomQuantity(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAddRoomModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={addRoomLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                disabled={addRoomLoading}
              >
                {addRoomLoading ? "Adding..." : "Add Room"}
              </button>
            </div>
          </form>
        </div>


      )}

      {extendModalOpen && selectedBooking && (
        <div
          className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeExtendModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Extend Booking Date</h3>
            <p className="mb-2">
              Current end date:{" "}
              <strong>{new Date(selectedBooking.end_date).toLocaleDateString()}</strong>
            </p>
            <label htmlFor="newEndDate" className="block mb-1 font-medium">
              New End Date
            </label>
            <input
              type="date"
              id="newEndDate"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min={new Date(selectedBooking.end_date).toISOString().split("T")[0]}
            />
            {submitError && <p className="text-red-600 mb-3">{submitError}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeExtendModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleExtendSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );

};
const GuestsContent = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 5; // Number of guests per page

  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/guests");
        setGuests(response.data);
      } catch (err) {
        setError("Failed to load guests");
        console.error("Guest fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // Filter guests based on search query
  const filteredGuests = guests.filter(
    (guest) =>
      guest.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );

  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Error and loading states
  if (loading)
    return <div className="p-4 text-gray-500">Loading guests...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Guests Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search guests..."
        className="mb-4 p-2 border rounded w-full"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Guest ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              First Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Last Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentGuests.map((guest) => (
            <tr key={guest.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{guest.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {guest.first_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{guest.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{guest.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {guest.phone_number}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard"); // 'dashboard', 'messages', 'rooms' or 'bookings'



  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    revenue: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsResponse = await axios.get(
          "http://localhost:5000/api/metrics"
        );
        setMetrics(metricsResponse.data);

        const recentBookingsResponse = await axios.get(
          "http://localhost:5000/api/recent-bookings"
        );
        setRecentBookings(recentBookingsResponse.data);

        const revenueResponse = await axios.get(
          "http://localhost:5000/api/revenue"
        );
        setMetrics((prev) => ({
          ...prev,
          revenue: revenueResponse.data.totalRevenue,
        }));

        const upcomingBookingsResponse = await axios.get(
          "http://localhost:5000/api/upcoming"
        );
        const mappedUpcoming = upcomingBookingsResponse.data.map((booking) => ({
          id: booking.booking_id,
          user: booking.guest_name,
          room: booking.room_type_name,
          checkIn: new Date(booking.start_date).toLocaleDateString(),
          checkOut: new Date(booking.end_date).toLocaleDateString(),
        }));
        setUpcomingBookings(mappedUpcoming);

        const recentInquiriesResponse = await axios.get(
          "http://localhost:5000/api/recent-inquiries"
        );
        setRecentInquiries(recentInquiriesResponse.data);

        const notificationsResponse = await axios.get(
          "http://localhost:5000/api/notifications"
        );
        setNotifications(notificationsResponse.data);

        const res = await axios.get(
          "http://localhost:5000/api/bookings/cancelled"
        );
        setCancelledBookings(cancelledBookings.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "guests", label: "Guests", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "rooms", label: "Rooms", icon: BedDouble },
    { id: "payment", label: "Payment", icon: DollarSign },
    { id: "reports", label: "Reports", icon: BarChart2 },

  ];

// ReportsContent: Add this inside your Dashboard component, above the return
const statusColors = {
  confirmed: "#22c55e", // green-500
  cancelled: "#ef4444", // red-500
  pending: "#eab308",   // yellow-500
};

const ReportsContent = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/reports/summary");
        setReport(res.data);
      } catch (err) {
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

 
  
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-600 text-lg">Loading report...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  if (!report) return null;

  // Prepare data for Pie Chart (Bookings by Status)
  const pieData = report.bookings_by_status.map(({ status, count }) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  // Prepare colors for Pie Chart cells
  const pieColors = pieData.map(
    (d) => statusColors[d.name.toLowerCase()] || "#8884d8"
  );

  // Prepare data for Frequently Booked Rooms
  const roomData = report.frequently_booked_rooms || [];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
        Reports & Analytics
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-50 p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Total Bookings</h3>
          <p className="text-4xl font-extrabold text-green-900">
            {report.total_bookings.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Total Revenue</h3>
          <p className="text-4xl font-extrabold text-purple-900">
            ₱{Number(report.total_revenue || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Bookings by Status
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, "Bookings"]}
                contentStyle={{ fontSize: "14px" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "14px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings per Month */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">
          Bookings per Month (Last 12 Months)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={report.bookings_per_month}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 14 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Bookings",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
                fontSize: 14,
              }}
              tick={{ fill: "#6b7280", fontSize: 14 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Revenue (₱)",
                angle: 90,
                position: "insideRight",
                fill: "#374151",
                fontSize: 14,
              }}
              tick={{ fill: "#6b7280", fontSize: 14 }}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") {
                  return `₱${Number(value).toLocaleString()}`;
                }
                return value;
              }}
              contentStyle={{ fontSize: "14px" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "14px" }}
              verticalAlign="top"
              height={36}
            />
            <Bar
              yAxisId="left"
              dataKey="count"
              fill="#3b82f6"
              name="Bookings"
              radius={[5, 5, 0, 0]}
              barSize={18}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#9333ea"
              name="Revenue"
              radius={[5, 5, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Frequently Booked Rooms */}
      <section className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">
          Frequently Booked Rooms
        </h3>
        {roomData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-gray-700 font-semibold">Room Name</th>
                    <th className="px-4 py-2 border-b text-right text-gray-700 font-semibold">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {roomData.map((room, idx) => (
                    <tr key={room.room_name} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2 border-b">{room.room_name}</td>
                      <td className="px-4 py-2 border-b text-right font-bold">{room.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Horizontal Bar Chart */}
            <ResponsiveContainer width="100%" height={Math.max(200, roomData.length * 40)}>
              <BarChart
                data={roomData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="room_name" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" name="Bookings" barSize={24} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </section>
    </div>
  );
};
  const handleSidebarItemClick = (id) => {
    setActivePage(id);
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      // Redirect to homepage or login page after logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-64"
          } bg-gray-900 text-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <h2 className="font-bold text-xl text-white">Donatela Admin</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-800 focus:outline-none"
          >
            <Menu size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4 space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarItemClick(item.id);
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 cursor-pointer ${activePage === item.id ? "bg-gray-700" : ""
                    }`}
                >
                  <item.icon size={20} className="mr-3 text-gray-400" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 mt-auto">
          <button
            className={`
      flex items-center 
      w-full 
      ${collapsed ? "justify-center px-0" : "justify-start px-2"} 
      py-3
      hover:bg-gray-800 
      rounded-lg 
      transition-all duration-300 ease-in-out
    `}
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut
              size={20}
              className={`text-gray-400 transition-all duration-300 ease-in-out ${collapsed ? "mx-auto" : "mr-3"
                }`}
            />
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold capitalize">{activePage}</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Bell with onClick */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
              onClick={() => setShowNotificationModal(true)}
              aria-label="Open notifications"
            >
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {notifications.length}
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "dashboard" && (
            <>
              <div className="bg-white p-6 mb-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  Welcome, Admin!
                </h2>
                <p className="text-gray-600">
                  Here's an overview of your system's current status.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-gray-500 mb-2 uppercase tracking-wider">
                    Total Bookings
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.totalBookings}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-gray-500 mb-2 uppercase tracking-wider">
                    Pending Bookings
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {metrics.pendingBookings}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-gray-500 mb-2 uppercase tracking-wider">
                    Revenue
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    ₱
                    {Number(metrics.revenue).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-gray-500 mb-2 uppercase tracking-wider">
                    Cancelled
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {metrics.cancelledBookings}
                  </p>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                <div className="divide-y divide-gray-200 max-h-[50vh] overflow-y-auto">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div key={booking.booking_id} className="py-3">
                        <p className="font-medium">
                          {booking.guest_name} - Room Type:{" "}
                          {booking.room_type_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.start_date).toLocaleDateString()} to{" "}
                          {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {booking.status}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent bookings found.</p>
                  )}
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Upcoming Bookings
                </h3>
                <div className="divide-y divide-gray-200 max-h-[50vh] overflow-y-auto">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <div key={booking.id} className="py-3">
                        <p className="font-medium">
                          {booking.user} - {booking.room || "No room assigned"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.checkIn} to {booking.checkOut}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No upcoming bookings found.</p>
                  )}
                </div>
              </div>

              {/* Notifications Section (Optional) */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                <div className="divide-y divide-gray-200 max-h-[50vh] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="py-3 flex items-center cursor-pointer hover:bg-gray-100 rounded px-2"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setShowNotificationModal(true);
                        }}
                      >
                        <Bell
                          size={16}
                          className="mr-2 text-blue-500 flex-shrink-0"
                        />
                        <p>{notification.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No notifications found.</p>
                  )}
                </div>
              </div>

              {showNotificationModal && (
                <div
                  className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
                  onClick={() => setShowNotificationModal(false)}
                >
                  <div
                    className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="notification-modal-title"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setShowNotificationModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
                      aria-label="Close notification details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-6">
                      <Bell className="text-blue-600 w-8 h-8" />
                      <h4
                        id="notification-modal-title"
                        className="text-2xl font-semibold text-gray-900"
                      >
                        Notification Details
                      </h4>
                    </div>

                    {/* Content */}
                    {selectedNotification ? (
                      <>
                        <p className="text-gray-800 text-lg leading-relaxed mb-4 whitespace-pre-wrap">
                          {selectedNotification.message}
                        </p>
                        {selectedNotification.created_at && (
                          <p className="text-gray-500 text-sm italic">
                            Received on {new Date(selectedNotification.created_at).toLocaleString()}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-10">No notification selected.</p>
                    )}

                    {/* Close Button */}
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setShowNotificationModal(false)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
          {activePage === "bookings" && <BookingsContent />}

          {activePage === "messages" && <MessagesContent />}
          {activePage === "rooms" && <RoomsContent />}
          {activePage === "guests" && <GuestsContent />}
          {activePage === "payment" && <PaymentDashboard />}
          {activePage === "reports" && <ReportsContent />}
        </main>
      </div>
    </div>
  );
};

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchBookingId, setSearchBookingId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [sortField, setSortField] = useState("payment_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, [
    currentPage,
    searchBookingId,
    filterStatus,
    filterMethod,
    sortField,
    sortOrder,
  ]);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: currentPage,
        limit: paymentsPerPage,
        booking_id: searchBookingId || undefined,
        status: filterStatus || undefined,
        method: filterMethod || undefined,
        sortField,
        sortOrder,
      };
      const response = await axios.get("http://localhost:5000/api/payments", {
        params,
      });
      if (response.data && Array.isArray(response.data.payments)) {
        setPayments(response.data.payments);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError("Invalid data format from server.");
        setPayments([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load payments.");
      setPayments([]);
      setTotalPages(1);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Payments Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Booking ID"
          className="p-2 border rounded"
          value={searchBookingId}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchBookingId(e.target.value);
          }}
          aria-label="Search by Booking ID"
        />

        <select
          className="p-2 border rounded"
          value={filterStatus}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterStatus(e.target.value);
          }}
          aria-label="Filter by Payment Status"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          className="p-2 border rounded"
          value={filterMethod}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterMethod(e.target.value);
          }}
          aria-label="Filter by Payment Method"
        >
          <option value="">All Methods</option>
          <option value="gcash">GCash</option>
          <option value="paypal">PayPal</option>
          {/* Add more methods as needed */}
        </select>
      </div>

      {/* Loading and error states */}
      {loading && <div className="p-4 text-gray-500">Loading payments...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {/* Payments Table */}
      {!loading && !error && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "Payment ID", field: "payment_id" },
                  { label: "Booking ID", field: "booking_id" },
                  { label: "Amount", field: "amount" },
                  { label: "Method", field: "payment_method" },
                  { label: "Status", field: "status" },
                  { label: "Transaction ID", field: "transaction_id" },
                  { label: "Date", field: "payment_date" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                    onClick={() => handleSort(field)}
                    aria-sort={
                      sortField === field
                        ? sortOrder === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {label}
                    {sortField === field && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.payment_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.booking_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₱{Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${statusColors[payment.status] ||
                          "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
