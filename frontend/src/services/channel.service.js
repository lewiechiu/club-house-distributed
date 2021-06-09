import httpClient from './httpClient';

const END_POINT = '/channel';

const getAllChannels = async () => {
  try {
    const response = await httpClient.get('/all_channels');
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const createChannel = async (uid, channel_name) => {
  const data = {
    action: 'create',
    uid: uid,
    channel_name: channel_name,
  };
  try {
    const response = await httpClient.post(END_POINT, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const enterChannel = async (uid, channel_id) => {
  const data = {
    action: 'enter',
    uid: uid,
    channel_id: channel_id,
  };
  try {
    const response = await httpClient.post(END_POINT, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const leaveChannel = async (uid, channel_id) => {
  const data = {
    action: 'leave',
    uid: uid,
    channel_id: channel_id,
  };
  try {
    const response = await httpClient.post(END_POINT, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const reloadChannel = async (uid, channel_id) => {
  const data = {
    action: 'reload',
    uid: uid,
    channel_id: channel_id,
  };
  try {
    const response = await httpClient.post(END_POINT, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default {
  getAllChannels,
  createChannel,
  enterChannel,
  leaveChannel,
  reloadChannel,
};
