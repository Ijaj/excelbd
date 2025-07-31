import { Cancel, CheckCircle, LocalShipping, Schedule } from '@mui/icons-material';

// Status configurations
export const statusConfig = {
  pending: { color: 'warning', icon: <Schedule />, label: 'Pending Pickup' },
  'picked-up': { color: 'primary', icon: <LocalShipping />, label: 'Picked up' },
  'in-transit': { color: 'primary', icon: <LocalShipping />, label: 'In Transit' },
  delivered: { color: 'success', icon: <CheckCircle />, label: 'Delivered' },
  failed: { color: 'error', icon: <Cancel />, label: 'Failed' },
  cancelled: { color: 'error', icon: <Cancel />, label: 'Cancelled' }
};

export const priorityConfig = {
  normal: { color: 'default', label: 'Normal' },
  high: { color: 'warning', label: 'High' },
  urgent: { color: 'error', label: 'Urgent' }
};

export const paymentMethods = {
  cod: { label: 'Cash On Delivery' },
  online: { label: 'Card or Bkash' }
};

// Mock data for parcels
export const mockParcels = [
  {
    id: 'BK001',
    trackingNumber: 'TRK123456789',
    status: 'in-transit',
    priority: 'high',
    sender: { name: 'John Smith', company: 'Tech Solutions Ltd', email: 'john@techsolutions.com', phone: '+1234567890' },
    recipient: { name: 'Sarah Johnson', company: 'Design Studio Inc', email: 'sarah@designstudio.com', phone: '+0987654321' },
    packageDetails: { weight: '2.5 kg', value: '$250', description: 'Electronics Equipment', dimensions: '30x20x15 cm' },
    dates: { created: '2024-01-15', pickup: '2024-01-15', estimated: '2024-01-17' },
    assignedAgent: 'AG003',
    cost: 45.99,
    location: 'Chicago Hub',
    paymentMethod: 'cod'
  },
  {
    id: 'BK002',
    trackingNumber: 'TRK987654321',
    status: 'pending',
    priority: 'normal',
    sender: { name: 'Mike Brown', company: 'ABC Corp', email: 'mike@abccorp.com', phone: '+1122334455' },
    recipient: { name: 'Lisa Davis', company: 'XYZ Ltd', email: 'lisa@xyzltd.com', phone: '+5566778899' },
    packageDetails: { weight: '1.2 kg', value: '$150', description: 'Office Supplies', dimensions: '25x15x10 cm' },
    dates: { created: '2024-01-16', pickup: null, estimated: '2024-01-18' },
    assignedAgent: null,
    cost: 25.5,
    location: 'New York Hub',
    paymentMethod: 'cod'
  },
  {
    id: 'BK003',
    trackingNumber: 'TRK456789123',
    status: 'delivered',
    priority: 'urgent',
    sender: { name: 'Anna Wilson', company: 'Fashion House', email: 'anna@fashionhouse.com', phone: '+9988776655' },
    recipient: { name: 'Tom Anderson', company: 'Retail Store', email: 'tom@retailstore.com', phone: '+4433221100' },
    packageDetails: { weight: '3.8 kg', value: '$500', description: 'Fashion Items', dimensions: '40x30x20 cm' },
    dates: { created: '2024-01-14', pickup: '2024-01-14', estimated: '2024-01-15' },
    assignedAgent: 'AG001',
    cost: 75.0,
    location: 'Los Angeles Hub',
    paymentMethod: 'online'
  },
  {
    id: 'BK004',
    trackingNumber: 'TRK111222333',
    status: 'picked-up',
    priority: 'high',
    sender: { name: 'Carlos Garcia', company: 'Medical Supplies Co', email: 'carlos@medsupply.com', phone: '+7788990011' },
    recipient: { name: 'Dr. Helen White', company: 'City Hospital', email: 'helen@cityhospital.com', phone: '+1122557788' },
    packageDetails: { weight: '5.2 kg', value: '$800', description: 'Medical Equipment', dimensions: '50x40x30 cm' },
    dates: { created: '2024-01-17', pickup: '2024-01-17', estimated: '2024-01-18' },
    assignedAgent: 'AG002',
    cost: 95.0,
    location: 'Dallas Hub',
    paymentMethod: 'cod'
  },
  {
    id: 'BK005',
    trackingNumber: 'TRK444555666',
    status: 'failed',
    priority: 'normal',
    sender: { name: 'Jennifer Lee', company: 'BookStore Plus', email: 'jen@bookstore.com', phone: '+3344556677' },
    recipient: { name: 'Mark Thompson', company: 'Library Services', email: 'mark@library.com', phone: '+9988774411' },
    packageDetails: { weight: '0.8 kg', value: '$75', description: 'Books', dimensions: '30x25x5 cm' },
    dates: { created: '2024-01-13', pickup: '2024-01-13', estimated: '2024-01-15' },
    assignedAgent: 'AG004',
    cost: 18.5,
    location: 'Miami Hub',
    paymentMethod: 'online'
  },
  {
    id: 'BK105',
    trackingNumber: 'TRK144555696',
    status: 'cancelled',
    priority: 'normal',
    sender: { name: 'Jennifer Lee', company: 'BookStore Plus', email: 'jen@bookstore.com', phone: '+3344556677' },
    recipient: { name: 'Mark Thompson', company: 'Library Services', email: 'mark@library.com', phone: '+9988774411' },
    packageDetails: { weight: '0.8 kg', value: '$75', description: 'Books', dimensions: '30x25x5 cm' },
    dates: { created: '2024-01-13', pickup: '2024-01-13', estimated: '2024-01-15' },
    assignedAgent: 'AG004',
    cost: 18.5,
    location: 'Miami Hub',
    paymentMethod: 'cod'
  }
];

// Mock data for agents
export const mockAgents = [
  { id: 'AG001', name: 'David Rodriguez', status: 'available', currentParcels: 2, maxCapacity: 5 },
  { id: 'AG002', name: 'Emma Thompson', status: 'busy', currentParcels: 4, maxCapacity: 5 },
  { id: 'AG003', name: 'James Wilson', status: 'available', currentParcels: 1, maxCapacity: 4 },
  { id: 'AG004', name: 'Sophie Chen', status: 'available', currentParcels: 3, maxCapacity: 6 },
  { id: 'AG005', name: 'Robert Johnson', status: 'busy', currentParcels: 5, maxCapacity: 5 }
];

export const drawerWidth = 240;
