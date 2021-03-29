import React from 'react';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import Modal from 'components/common/Modal';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addFloorPlansSchema } from 'components/forms/schemas/propertySchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Upload from 'components/utils/Upload';
import Input from 'components/forms/Input';
import Image from 'components/utils/Image';
import { Accordion } from 'react-bootstrap';
import { ArrowDownIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { ArrowUpIcon } from 'components/utils/Icons';
import { LinkSeparator } from 'components/common/Helpers';

export const FloorPlansForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  floorPlan,
}) => {
  const [toast] = useToast();
  const [image, setImage] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addFloorPlansSchema, {
        name: floorPlan?.name,
      })}
      onSubmit={({ name }, actions) => {
        const payload = {
          name,
          plan: image || floorPlan?.plan,
        };

        if (!payload.plan) {
          setToast({ message: 'Kindly upload a Floor Plans' });
          return;
        }

        Axios({
          method: floorPlan?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/property/${property._id}/floorplan`,
          data: floorPlan?._id
            ? { ...payload, floorPlanId: floorPlan?._id }
            : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your floor plans has been successfully ${
                  floorPlan?._id ? 'updated' : 'added'
                }`,
              });
              hideForm();
              setProperty(data.property);
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
      validationSchema={createSchema(addFloorPlansSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <section className="row">
            <div className="col-md-10 px-4">
              <h5>Add Floor Plans</h5>
              <Input label="Title" name="name" placeholder="Title" />
              <div className="my-4">
                <Upload
                  afterUpload={(image) => setImage(image)}
                  changeText={`Update Floor Plan`}
                  defaultImage={PropertyPlaceholderImage}
                  imgOptions={{ className: 'mb-3', watermark: true }}
                  name="floorPlan"
                  oldImage={floorPlan?.plan}
                  uploadText={`Upload Floor Plan`}
                />
              </div>
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Add Floor Plan
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddFloorPlans = ({
  className,
  setToast,
  setProperty,
  property,
}) => {
  const [showAddFloorPlansModal, setShowAddFloorPlansModal] = React.useState(
    false
  );
  return (
    <>
      <span
        className={className}
        onClick={() => setShowAddFloorPlansModal(true)}
      >
        Add Floor Plans
      </span>

      <Modal
        title="Floor Plans"
        show={showAddFloorPlansModal}
        onHide={() => setShowAddFloorPlansModal(false)}
        showFooter={false}
        size="lg"
      >
        <FloorPlansForm
          hideForm={() => setShowAddFloorPlansModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
    </>
  );
};

export const FloorPlansList = ({ property, setProperty, setToast }) => {
  const [showEditFloorPlansModal, setShowEditFloorPlansModal] = React.useState(
    false
  );
  const [
    showDeleteFloorPlansModal,
    setShowDeleteFloorPlansModal,
  ] = React.useState(false);

  const [floorPlan, setFloorPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const deleteFloorPlan = () => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/${property._id}/floorPlan`, {
      headers: { Authorization: getTokenFromStore() },
      data: { floorPlanId: floorPlan._id },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Image has been successfully deleted`,
          });
          setProperty(data.property);
          setShowDeleteFloorPlansModal(false);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  return (
    <>
      {property?.floorPlans?.length > 0 && (
        <div className="property__floor-plans mt-5">
          <h5 className="header-smaller mb-3">Floor Plans</h5>
          <Accordion>
            {property?.floorPlans.map(({ _id, name, plan }, index) => (
              <Card key={_id}>
                <Accordion.Toggle
                  as={Card.Header}
                  variant="link"
                  eventKey={index + 1}
                >
                  <ContextAwareToggle
                    iconOpen={<ArrowUpIcon />}
                    iconClose={<ArrowDownIcon />}
                    eventKey={index + 1}
                  >
                    {name}
                  </ContextAwareToggle>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index + 1}>
                  <Card.Body>
                    <Image src={plan} alt={name} name={name} bordered />
                    <p className="mb-4">
                      <a href={plan} className="text mt-3">
                        {plan}
                      </a>{' '}
                    </p>
                    <span
                      className="text-link text-muted"
                      onClick={() => {
                        setFloorPlan({ _id, name, plan });
                        setShowEditFloorPlansModal(true);
                      }}
                    >
                      Edit Floor Plan
                    </span>
                    <LinkSeparator />
                    <span
                      className="text-link  text-muted"
                      onClick={() => {
                        setFloorPlan({ _id, name, plan });
                        setShowDeleteFloorPlansModal(true);
                      }}
                    >
                      Delete Floor Plan
                    </span>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
            {/* Edit FloorPlans Modal */}
            <Modal
              title="FloorPlans"
              show={showEditFloorPlansModal}
              onHide={() => setShowEditFloorPlansModal(false)}
              showFooter={false}
            >
              <FloorPlansForm
                hideForm={() => setShowEditFloorPlansModal(false)}
                property={property}
                setProperty={setProperty}
                setToast={setToast}
                floorPlan={floorPlan}
              />
            </Modal>

            {/* Delete FloorPlans Modal */}
            <Modal
              title="Verify Vendor"
              show={showDeleteFloorPlansModal}
              onHide={() => setShowDeleteFloorPlansModal(false)}
              showFooter={false}
            >
              <section className="row">
                <div className="col-md-12 my-3 text-center">
                  <Image
                    src={floorPlan?.plan}
                    name={floorPlan?.name || 'unknown'}
                    options={{ h: 200 }}
                    responsiveImage={true}
                  />
                  <p className="my-4 font-weight-bold">
                    Are you sure you want to delete this Floor Plan
                  </p>
                  <Button
                    loading={loading}
                    className="btn btn-secondary mb-5"
                    onClick={() => deleteFloorPlan()}
                  >
                    Delete Floor Plan
                  </Button>
                </div>
              </section>
            </Modal>
          </Accordion>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <AddFloorPlans
            className="btn btn-secondary btn-xs btn-wide"
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
        </div>
      </div>
    </>
  );
};
