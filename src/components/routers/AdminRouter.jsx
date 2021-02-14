import React from 'react';
import { Router } from '@reach/router';
import Dashboard from 'components/pages/admin/Dashboard';
import Users from 'components/pages/admin/Users';
import SingleUser from 'components/pages/admin/SingleUser';
import Portfolios from 'components/pages/shared/Portfolios';
import SinglePortfolio from 'components/pages/shared/SinglePortfolio';
import ScheduledVisits from 'components/pages/admin/ScheduledVisits';
import Transactions from 'components/pages/admin/Transactions';
import KnowledgeBase from 'components/pages/admin/KnowledgeBase';
import Menu from 'components/pages/user/Menu';
import Enquiries from 'components/pages/admin/Enquiries';
import ViewEnquiry from 'components/pages/admin/ViewEnquiry';
import AssignedProperties from 'components/pages/admin/AssignedProperties';
import AddTransaction from 'components/pages/admin/AddTransaction';
import NewTransaction from 'components/pages/admin/NewTransaction';

const AdminRouter = () => (
  <Router>
    <Dashboard path="dashboard" />
    <Users path="users" />
    <SingleUser path="user/:id" />
    <Portfolios path="portfolios" />
    <SinglePortfolio path="portfolio/:id" />
    <ScheduledVisits path="scheduled-visits" />
    <ViewEnquiry path="enquiry/:id" />
    <AssignedProperties path="assigned-properties" />
    <Enquiries path="enquiries" />
    <Transactions path="transactions" />
    <AddTransaction path="add-transaction" />
    <NewTransaction path="transactions/new/:offerId" />
    <KnowledgeBase path="knowledgebase" />
    <Menu path="menu" />
  </Router>
);

export default AdminRouter;
