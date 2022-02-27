/* eslint-disable */

import { showAlert } from './alerts';

// "options will be the data to updated"
// "type" will to update "data" or "password"
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || 'Cannot update data');
    }

    showAlert('success', `${type.toUpperCase()} updated successfully!`);
  } catch (err) {
    showAlert('error', err.message);
  }
};
