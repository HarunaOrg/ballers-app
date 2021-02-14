export const INITIAL_STATE = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phone2: '',
  address: {
    street1: '',
    street2: '',
    city: '',
    state: '',
    country: '',
  },
  role: 1,
  referralCode: '',
  profileImage: '',
  isLoggedIn: false,
  notifications: [],
  assignedProperties: [],
  referrals: [],
  preferences: {},
  favorites: [],
  availableOptions: {
    states: [],
    houseTypes: [],
  },
  alert: null,
  vendor: {},
};

// property creation
// property description
// offer letter (done)
// offer letter expiration
// enquiries and visitation list pagination
// upload pdf
