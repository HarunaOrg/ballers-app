import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card, ProgressBar } from 'react-bootstrap';
import { Link } from '@reach/router';
import { BASE_API_URL } from 'utils/constants';
import Modal from 'components/common/Modal';
import { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import { RightArrowIcon } from 'components/utils/Icons';
import { getTokenFromStore } from 'utils/localStorage';
import { MyPropertyIcon } from 'components/utils/Icons';
import { getLongDate } from 'utils/date-helpers';
import { VisitationIcon } from 'components/utils/Icons';
import { CancelVisitForm } from './ProcessVisitation';
import { RescheduleVisitForm } from './ProcessVisitation';
import { ScheduleVisitForm } from './ProcessVisitation';
import { useGetQuery } from 'hooks/useQuery';
import { BASE_API } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OwnedPropertyCard } from '../shared/SinglePortfolio';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const SinglePortfolio = ({ id, assigned }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property, setProperty] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: BASE_API.getOneProperty(id),
    refresh: true,
  });
  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!property}
        Icon={<MyPropertyIcon />}
        query={propertyQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <OwnedPropertyCard
          property={property}
          setToast={setToast}
          setProperty={setProperty}
          Sidebar={
            assigned ? (
              <AssignedPropertySidebar />
            ) : (
              <PropertySidebar
                property={property}
                visitationInfo={property?.visitationInfo}
                enquiryInfo={property?.enquiryInfo}
                setToast={setToast}
              />
            )
          }
        />
      </ContentLoader>
    </BackendPage>
  );
};

const NOW = 50;

const AssignedPropertySidebar = () => {
  const initiatePayment = () => {
    Axios.post(
      `${BASE_API_URL}/payment/initiate`,
      {
        amount: '100000',
        propertyId: '5f5e8e7576fca200172adf6f',
        offerId: '5f7183398d65710017cfbd1e',
      },
      {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }
    )
      .then(function (response) {
        const { status, data } = response;
        if (status === 201) {
          window.location.href = data.payment.authorization_url;
        }
      })
      .catch(function (error) {});
  };
  return (
    <Card className="card-container property-holder">
      <table className="table table-sm table-borderless">
        <tbody>
          <tr>
            <td>
              <small className="ml-n1">Amount Contributed</small>{' '}
            </td>
            <td>
              <h5>N35,000,000</h5>
            </td>
          </tr>
          <tr>
            <td>
              <small className="ml-n1">Equity Contributed</small>{' '}
            </td>
            <td>
              <h5>N35,000,000</h5>
            </td>
          </tr>
        </tbody>
      </table>

      <small className="">Contribution Progress</small>

      <div className="row">
        <div className="col-sm-12">
          <small style={{ paddingLeft: `${NOW - 5}%` }}>{NOW}%</small>
          <ProgressBar variant="success" now={NOW} label={`${NOW}%`} srOnly />
        </div>
      </div>

      <hr className="my-4" />

      <small className="">Next Payment</small>
      <h5 className="text-center my-3">14th October 2020</h5>

      <button className="btn btn-block btn-secondary" onClick={initiatePayment}>
        Make Payment
      </button>
      <Link to="/users/transaction" className="small text-center mt-3">
        View Transaction History
      </Link>
    </Card>
  );
};

const PropertySidebar = ({
  property,
  visitationInfo,
  enquiryInfo,
  setToast,
}) => {
  const [showRequestVisitForm, setShowRequestVisitForm] = React.useState(false);
  const [showTitleDocument, setShowTitleDocument] = React.useState(false);
  const userHasScheduledVisit =
    visitationInfo?.length > 0 &&
    visitationInfo?.[visitationInfo.length - 1].status === 'Pending';
  const userHasPreviousEnquiry = !!enquiryInfo;
  const [showReschedule, setShowReschedule] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const alreadyVisitedProperty = visitationInfo?.some(
    (visit) => visit.status === 'Resolved'
  );

  return (
    <>
      <Modal
        title="Schedule visit"
        show={showRequestVisitForm}
        onHide={() => setShowRequestVisitForm(false)}
        showFooter={false}
      >
        {userHasScheduledVisit ? (
          <>
            {/* show cancel visitation */}
            {showCancelModal && (
              <>
                <h6>Cancel Modal Form</h6>

                <CancelVisitForm
                  visitationInfo={visitationInfo?.[visitationInfo.length - 1]}
                  hideForm={() => setShowRequestVisitForm(false)}
                  setToast={setToast}
                />

                <div className="text-right">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="btn btn-danger btn-sm mt-5"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* reschedule visitation */}
            {showReschedule && !showCancelModal && (
              <>
                <h6>Reschedule Form</h6>
                <RescheduleVisitForm
                  visitationInfo={visitationInfo?.[visitationInfo.length - 1]}
                  hideForm={() => setShowRequestVisitForm(false)}
                  setToast={setToast}
                />
                <div className="text-right">
                  <button
                    onClick={() => setShowReschedule(false)}
                    className="btn btn-danger btn-sm mt-5"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* show visitation information */}
            {!showReschedule && !showCancelModal && (
              <>
                <table className="table table-hover table-borderless">
                  <tbody>
                    <tr>
                      <td>Name </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorName
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Email </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorEmail
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Phone </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorPhone
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Visit Date </td>
                      <td>
                        {getLongDate(
                          visitationInfo?.[visitationInfo.length - 1].visitDate
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  onClick={() => setShowReschedule(true)}
                  className="btn btn-sm btn-primary"
                >
                  Reschedule Visitation
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel Visitation
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => setShowRequestVisitForm(false)}
                  className="btn btn-sm btn-danger"
                >
                  Close Modal
                </button>
              </>
            )}
          </>
        ) : (
          <ScheduleVisitForm
            hideForm={() => setShowRequestVisitForm(false)}
            propertyId={property._id}
            setToast={setToast}
          />
        )}
      </Modal>
      <Card className="card-container property-holder bg-gray">
        <h5>Interested in this property?</h5>

        <p className="">
          {userHasPreviousEnquiry
            ? 'You already made previous enquiries'
            : 'Kindly proceed with property acquisition'}
        </p>
        <Link
          to={`/user/property/enquiry/${property._id}`}
          className="btn btn-block btn-secondary my-3"
        >
          {userHasPreviousEnquiry ? 'Make Another Enquiry' : 'Proceed'}
        </Link>
      </Card>

      {userHasScheduledVisit ? (
        <>
          <h5 className="header-smaller">You have an upcoming visit</h5>
          <Card
            className="card-container property-holder bg-gray card-link"
            onClick={() => setShowRequestVisitForm(true)}
          >
            <p className="mr-4">
              Your visitation date is on
              <br />{' '}
              <strong className="text-danger">
                {getLongDate(
                  visitationInfo?.[visitationInfo.length - 1].visitDate
                )}
              </strong>
            </p>
            <div className="circle-icon">
              <VisitationIcon />
            </div>
          </Card>
        </>
      ) : (
        <>
          <h5 className="header-smaller">Schedule a tour</h5>
          <Card
            className="card-container property-holder bg-gray card-link"
            onClick={() => setShowRequestVisitForm(true)}
          >
            {alreadyVisitedProperty ? (
              <p className="mr-4">
                You have already visited this property
                <br /> Request another visit.
              </p>
            ) : (
              <p className="mr-4">
                Want to come check the property?
                <br /> Request a visit.
              </p>
            )}
            <div className="circle-icon">
              <RightArrowIcon />
            </div>
          </Card>
        </>
      )}

      <h5 className="header-smaller">View title document</h5>
      <Modal
        title="Title Document"
        show={showTitleDocument}
        onHide={() => setShowTitleDocument(false)}
        showFooter={false}
      >
        {property.titleDocument}
      </Modal>
      <Card
        className="card-container property-holder bg-gray card-link"
        onClick={() => setShowTitleDocument(true)}
      >
        <p className="mr-4">View a copy of the property document.</p>
        <div className="circle-icon bg-green">
          <RightArrowIcon />
        </div>
      </Card>
    </>
  );
};

export default SinglePortfolio;