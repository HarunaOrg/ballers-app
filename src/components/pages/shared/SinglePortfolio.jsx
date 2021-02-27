import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Map from 'components/common/Map';
import { BASE_API_URL, USER_TYPES } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import { CheckIcon, DownloadIcon, MapPinIcon } from 'components/utils/Icons';
import { getTokenFromStore } from 'utils/localStorage';
import NoContent from 'components/utils/NoContent';
import { moneyFormatInNaira, getError } from 'utils/helpers';
import { MyPropertyIcon } from 'components/utils/Icons';
import Image from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import Modal from 'components/common/Modal';
import { Link } from '@reach/router';
import { UserContext } from 'context/UserContext';
import { CameraIcon } from 'components/utils/Icons';
import { BathIcon } from 'components/utils/Icons';
import { ToiletIcon } from 'components/utils/Icons';
import { BedIcon } from 'components/utils/Icons';

const SinglePortfolio = ({ id }) => {
  const [toast, setToast] = useToast();
  const [property, setProperty] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/property/${id}`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setProperty(data.property);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast, id]);
  return (
    <BackendPage>
      {property ? (
        <OwnedPropertyCard property={property} toast={toast} />
      ) : (
        <NoContent text="Loading Property" Icon={<MyPropertyIcon />} />
      )}
    </BackendPage>
  );
};

const OwnedPropertyCard = ({ property, toast }) => (
  <div className="container-fluid">
    <Toast {...toast} />
    <Card className="card-container mt-4 h-100 property-holder__big">
      <div className="row">
        <div className="col-sm-10">
          <h3 className={`property-holder__big-title border-success`}>
            {property.name}
          </h3>
        </div>
      </div>
      <PropertyImage property={property} />
      <div className="row mt-5">
        <div className="col-sm-12">
          <PropertyDescription property={property} />
        </div>
      </div>
      <Neighborhood />
    </Card>
    <PropertyMap mapLocation={property.mapLocation} />
  </div>
);

export const PropertyImage = ({ property }) => (
  <div className="row">
    <div className="col-sm-12">
      <Image
        defaultImage={PropertyPlaceholderImage}
        src={property.mainImage}
        name="Property Image"
        className="img-fluid gallery-main-image property-img"
        watermark
      />
    </div>
    {true || <Gallery />}
  </div>
);

const Gallery = () => (
  <div className="col-sm-2">
    <aside className="row gallery-row">
      <div className="gallery-col col-3 col-md-12">
        <img
          src={PropertyPlaceholderImage}
          alt="Property"
          className="img-fluid gallery-thumbnails property-img"
        />
      </div>
      <div className="gallery-col col-3 col-md-12">
        <img
          src={PropertyPlaceholderImage}
          alt="Property"
          className="img-fluid gallery-thumbnails property-img"
        />
      </div>
      <div className="gallery-col col-3 col-md-12">
        <img
          src={PropertyPlaceholderImage}
          alt="Property"
          className="img-fluid gallery-thumbnails property-img"
        />
      </div>
      <div className="gallery-col col-3 col-md-12">
        <Link to="/user/gallery" className="overlay overlay__secondary">
          <img
            src={PropertyPlaceholderImage}
            alt="Property"
            className="img-fluid gallery-thumbnails property-img mb-0"
          />
          <span>
            <CameraIcon /> <br />
            View Gallery
          </span>
        </Link>
      </div>
    </aside>
  </div>
);

export const PropertyDescription = ({ property }) => {
  const [showFloorPlansModal, setShowFloorPlansModal] = React.useState(false);
  const { userState } = React.useContext(UserContext);
  const [showPhoneNumber, setShowPhoneNumber] = React.useState(false);
  console.log('property', property);

  return (
    <>
      <Modal
        title="Floor Plans"
        show={showFloorPlansModal}
        onHide={() => setShowFloorPlansModal(false)}
        showFooter={false}
        size="lg"
      >
        <Image
          src={property.floorPlans}
          name={property.name}
          options={{ h: 1000 }}
        />
      </Modal>
      <h5 className="mb-4">
        <span className="text-secondary">
          <MapPinIcon />
        </span>{' '}
        {property.address.street1}
      </h5>
      <div className="row">
        <div className="col-6">
          <small>Property Value</small>
          <h5>{moneyFormatInNaira(property.price)}</h5>
        </div>
        <div className="col-6">
          <small>House Type</small>
          <h5>{property.houseType}</h5>
        </div>
        <div className="col-4">
          <h5>
            <BedIcon />
            {property.bedrooms}
          </h5>
        </div>
        <div className="col-4">
          <h5>
            <BathIcon />
            {property.bathrooms}
          </h5>
        </div>
        <div className="col-4">
          <h5>
            <ToiletIcon /> {property.toilets}
          </h5>
        </div>
      </div>

      <h5 className="mt-5">Vendor</h5>
      <img
        alt={property?.vendorInfo?.vendor?.companyName || ''}
        className="img-fluid img-small"
        src={property?.vendorInfo?.vendor?.companyLogo}
        title={property?.vendorInfo?.vendor?.companyName}
      />
      {!showPhoneNumber ? (
        <p onClick={() => setShowPhoneNumber(true)}>
          Click to reveal Phone Number
        </p>
      ) : (
        <p className="strong">Phone Number: {property?.vendorInfo?.phone}</p>
      )}

      <h5 className="mt-5">About Property</h5>
      <p className="">{property.description}</p>

      {userState?.role === USER_TYPES.vendor && (
        <Link
          className="btn btn-secondary"
          to={`/vendor/portfolios/edit/${property._id}`}
        >
          Edit Property
        </Link>
      )}

      {true || (
        <div className="my-5">
          <button
            onClick={() => setShowFloorPlansModal(true)}
            className="btn btn-link icon-box"
          >
            View floor plans{' '}
            <span className="d-inline-block ml-2">
              <DownloadIcon />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export const Neighborhood = () => (
  <>
    <h5 className="mt-5">The neighbourhood</h5>
    <div className="row">
      <div className="col-sm-4">
        <NeighborhoodCheck name="Schools" color="blue" />
      </div>
      <div className="col-sm-4">
        <NeighborhoodCheck name="Hospitals" color="orange" />
      </div>
      <div className="col-sm-4">
        <NeighborhoodCheck name="Shopping Mall" color="purple" />
      </div>
      <div className="col-sm-4">
        <NeighborhoodCheck name="Entertainment" color="green" />
      </div>
      <div className="col-sm-4">
        <NeighborhoodCheck name="Restaurant & Bars" color="blue" />
      </div>
      <div className="col-sm-4">
        <NeighborhoodCheck name="Parks" color="pink" />
      </div>
    </div>
  </>
);

const NeighborhoodCheck = ({ name, color }) => (
  <div className="neighborhood-check icon-box">
    <span className={color}>
      <CheckIcon />
    </span>
    {name}
  </div>
);

export const PropertyMap = ({ mapLocation }) =>
  mapLocation ? (
    mapLocation.latitude &&
    mapLocation.longitude && (
      <div style={{ height: '15rem', marginTop: '-2px' }}>
        <Map
          coordinates={{
            lat: mapLocation.latitude,
            lng: mapLocation.longitude,
          }}
        />
      </div>
    )
  ) : (
    <></>
  );

export default SinglePortfolio;