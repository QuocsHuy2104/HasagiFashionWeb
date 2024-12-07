export const refreshTokenSetup = (res) => {
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 50) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthRespose();

    refreshTiming = (newAuthRes.expires_in || 3600 - 50) * 1000;

    console.log("new AuthRes", newAuthRes);

    console.log("new Token", newAuthRes.id_token);

    setTimeou(refreshToken, refreshTiming);
  };
  setTimeou(refreshToken, refreshTiming);
};