/* Changes the input value of the element that matches the selector
 * .change() is needed for the material floating labels to work.
 */
const changeInputValue = (jquerySelector, newValue) => {
  $(jquerySelector).val(newValue);
  $(jquerySelector).change();
};


const showLoadingSpinner = (jquerySelector) => {
  $(jquerySelector).LoadingOverlay('show', {
    image: '',
    fontawesome: 'fa fa-pulse fa-spinner fa-spin',
  });
};

const hideLoadingSpinner = (jquerySelector) => {
  $(jquerySelector).LoadingOverlay('hide');
};

exports.changeInputValue = changeInputValue;
exports.showLoadingSpinner = showLoadingSpinner;
exports.hideLoadingSpinner = hideLoadingSpinner;
