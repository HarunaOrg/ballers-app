import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { addEnquirySchema } from 'components/forms/schemas/enquirySchema';
import { Card } from 'react-bootstrap';
import DatePicker from 'components/forms/DatePicker';
import RadioSelect from 'components/forms/RadioSelect';
import { BASE_API_URL, TITLES } from 'utils/constants';
import Address from 'components/utils/Address';
import {
  createSchema,
  addressSchema,
} from 'components/forms/schemas/schema-helpers';
import { UserContext } from 'context/UserContext';
import { getError, valuesToOptions } from 'utils/helpers';
import { getTokenFromStore } from 'utils/localStorage';
import InputFormat from 'components/forms/InputFormat';
import Select from 'components/forms/Select';
import { useGetQuery } from 'hooks/useQuery';
import { BASE_API } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { MessageIcon } from 'components/utils/Icons';
import { PropertyImage } from '../shared/SingleProperty';
import { PropertyHeader } from '../shared/SingleProperty';

const pageOptions = {
  key: 'property',
  pageName: 'Property Enquiries',
};

const PropertyEnquiry = ({ id }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: BASE_API.getOneProperty(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <section className="container-fluid">
        <h4>Property Enquiry</h4>
        <ContentLoader
          hasContent={!!property}
          Icon={<MessageIcon />}
          query={propertyQuery}
          name={pageOptions.pageName}
          toast={toast}
        >
          <Card className="card-container mb-4 h-100 property-holder__big">
            <PropertyImage property={property} hideGallery />
            <div className="my-4">
              <PropertyHeader property={property} />
            </div>
          </Card>
        </ContentLoader>
        <EnquiryForm id={id} setToast={setToast} />
      </section>
    </BackendPage>
  );
};

const EnquiryForm = ({ id, setToast }) => {
  const { userState } = React.useContext(UserContext);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...setInitialValues(addEnquirySchema, {
          ...userState,
          investmentStartDate: { date: new Date() },
        }),
        address: setInitialValues(addressSchema, userState.address),
      }}
      onSubmit={(values, actions) => {
        // delete optional fields
        !values.address.street2 && delete values.address.street2;
        !values.address.otherName && delete values.address.otherName;

        // build payload
        const payload = {
          ...values,
          investmentStartDate:
            values.investmentStartDate.date || values.investmentStartDate,
          propertyId: id,
        };

        Axios.post(`${BASE_API_URL}/enquiry/add`, payload, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: 'Your enquiry has been successfully submitted',
              });
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema({
        ...addEnquirySchema,
        address: createSchema(addressSchema),
      })}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <ClientDetailsForm />
          <PropertyAddress />
          <PropertyDetailsForm />
          <InvestmentDetailsForm />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit Form
          </Button>
          <DisplayFormikState {...props} hide showAll />
        </Form>
      )}
    </Formik>
  );
};

const ClientDetailsForm = () => (
  <Card className="card-container">
    <section className="row">
      <div className="col-md-10">
        <h5>Client Details</h5>
        <div className="form-row">
          <Select
            placeholder="Select Title"
            formGroupClassName="col-md-6"
            label="Title"
            name="title"
            options={valuesToOptions(TITLES)}
          />
          <Input
            formGroupClassName="col-md-6"
            label="First Name"
            name="firstName"
            placeholder="First Name"
          />
        </div>
        <div className="form-row">
          <Input
            formGroupClassName="col-md-6"
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
          />
          <Input
            formGroupClassName="col-md-6"
            label="Other Names"
            name="otherName"
            optional
            placeholder="Other Names"
          />
        </div>

        <div className="form-row">
          <Input
            formGroupClassName="col-md-6"
            label="Email"
            name="email"
            placeholder="Email Address"
          />
          <Input
            formGroupClassName="col-md-6"
            label="Phone"
            name="phone"
            placeholder="Phone"
          />
        </div>

        <Input
          label="Occupation/Nature of Business"
          name="occupation"
          placeholder="Occupation/Nature of Business"
        />
      </div>
    </section>
  </Card>
);

const PropertyAddress = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Address</h5>

        <Address />
      </div>
    </section>
  </Card>
);

const PropertyDetailsForm = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Property Details</h5>

        <Input
          label="Name on Title Document"
          name="nameOnTitleDocument"
          placeholder="Name on Title Document"
        />
      </div>
    </section>
  </Card>
);

const InvestmentDetailsForm = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Investment Details</h5>

        <DatePicker
          label="Start Date"
          name="investmentStartDate"
          placeholder="State Date"
        />

        <InputFormat
          label="Initial Investment Amount"
          name="initialInvestmentAmount"
          placeholder="Initial Investment"
        />

        <RadioSelect
          label="Investment Frequency"
          name="investmentFrequency"
          options={[
            { label: 'Monthly', value: '1' },
            { label: 'Quarterly', value: '4' },
            { label: 'Voluntarily', value: '0' },
          ]}
          labelSizeClassName="col-sm-4"
          radioSizeClassName="col-sm-8"
          inline
          custom
        />

        <InputFormat
          label="Periodic Investment"
          name="periodicInvestmentAmount"
          placeholder="Periodic Investment"
        />
      </div>
    </section>
  </Card>
);

export default PropertyEnquiry;
