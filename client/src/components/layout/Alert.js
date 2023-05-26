import React from "react";
import PropTypes from "prop-types";

// To interact with the components state, we need to import the connect method from react-redux.
import { connect } from "react-redux";

const Alert = ({ alerts }) => (
    <div className="alert-wrapper">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  );

Alert.propTypes = {
alerts: PropTypes.array.isRequired
};
  
const mapStateToProps = (state) => ({
alerts: state.alert
});
  
export default connect(mapStateToProps)(Alert);