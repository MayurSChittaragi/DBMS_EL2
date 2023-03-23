import pandas as pd
from prophet import Prophet
df = pd.read_csv('/home/mayur/Desktop/BILLING.csv')
# df.head()
print(df)
m = Prophet()
m.fit(df)
future = m.make_future_dataframe(periods=10)
# future.tail()
forecast = m.predict(future)
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']])
forecast[['ds', 'yhat']].to_json('client/src/forecast.json');
# fig1 = m.plot(forecast)
