import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { Link } from '@reach/router';
import { moneyFormatInNaira, getError } from 'utils/helpers';
import { MyPropertyIcon } from 'components/utils/Icons';
import TopTitle from 'components/utils/TopTitle';

const Portfolios = () => {
  const [toast, setToast] = useToast();
  const [portfolios, setPortfolios] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/property/all`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setPortfolios(data.properties);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast]);
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <TopTitle buttonText="New Portfolio" to="/admin/portfolios/new">
        All Portfolios
      </TopTitle>
      <AllPortfolios portfolios={portfolios} toast={toast} />
    </BackendPage>
  );
};

const AllPortfolios = ({ portfolios, toast }) => (
  <LoadItems
    Icon={<MyPropertyIcon />}
    items={portfolios}
    loadingText="Loading your Portfolios"
    noContent={
      <NoContent
        isButton
        Icon={<MyPropertyIcon />}
        text="No Portfolios found"
      />
    }
  >
    <PortfoliosRowList toast={toast} portfolios={portfolios || []} />
  </LoadItems>
);

const PortfoliosRowList = ({ portfolios }) => (
  <div className="container-fluid">
    <Card className="mt-2">
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio, index) => (
              <PortfoliosRow key={index} number={index + 1} {...portfolio} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

PortfoliosRowList.propTypes = {
  portfolios: PropTypes.array.isRequired,
};

const PortfoliosRow = ({ _id, name, address, price, number, mainImage }) => (
  <tr>
    <td>{number}</td>
    <td>
      <Link to={`/admin/portfolio/${_id}`}>
        <img src={mainImage} width="80" alt="property" />
      </Link>
    </td>
    <td>{name}</td>
    <td>
      <strong>
        {address.city}, {address.state}
      </strong>
    </td>
    <td>{moneyFormatInNaira(price)}</td>
    <td>
      <Link className="btn btn-sm btn-secondary" to={`/admin/portfolio/${_id}`}>
        View property
      </Link>
    </td>
  </tr>
);

export default Portfolios;