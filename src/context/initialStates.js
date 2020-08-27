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
  profileImg: '',
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
};
