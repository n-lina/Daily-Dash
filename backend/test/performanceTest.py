import requests
import logging
import argparse

dev_token = "test"
user_id = 'RPeq88j3J7YPusoSsRcHg5rXepn1'
base_url = "http://18.221.217.95:3000"

failed = 0
tests = 0

######################### HTTP Request Helpers #########################
# Write new tests below this section

def get_header(token: str) -> dict:
    """
    Get the HTTP header for a given token

    Parameters:
    token (str): auth token (JWT)

    Returns:
    dict: the headers for the HTTP request
    """
    return {'Content-Type': 'application/json',
           'Authorization': 'Bearer {0}'.format(token)}

def send_get(endpoint: str, token: str, params=None):
    """
    Test an endpoint that uses a get REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    params (dict): parameters for get request
    """
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    response = requests.get(url, params=params, headers=headers)

    return response

def send_post(endpoint: str, token: str, data):
    """
    Test an endpoint that uses a post REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    body (dict): NOT USED - body for the post request
    """
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    # data['body'] = json.dumps(body)
    response = requests.post(url, json=data, headers=headers)

    return response

######################### Tests #########################
# Write new tests below this section

def test_post_users_time():
  global tests
  global failed
  total_time = 0

  for i in range(100):
    response = send_post('/users', dev_token, data={
      "id": i,
      "email": i,
      "username": i,
      "notificationId": "eysn1FN-RhGZ4ptNSqBZyR:APA91bGi5OqkOdoxRosRXmqU5WMEKObJbIdC5QgZQqKX9-BnspCi6LCAsrevL9bFU8pEQp0NXc8YwHVDCHAvTy2YP2C__PZgJX7E5zD7J3guQ9258CsmoMJAT93mQCRttfVIfIpgm56v"
      }
    )
    total_time += response.elapsed.total_seconds()

  avg_time = total_time / 100
  print(avg_time)
  if avg_time < 2:
    tests += 1
  else:
    failed += 1

def test_post_goals_time():
  global tests
  global failed
  total_time = 0

  for i in range(100):
    response = send_post('/goals', dev_token, data={'userId': i,
      "title": i,
      "description": "irrelevant words",
      "shortTermGoals": [
        {
          "title": "Do a coding challenge practice problem each weekday.",
          "mon": [
            5,
            15
          ],
          "wed": [
            30,
            20
          ]
        }]
      }
    )
    total_time += response.elapsed.total_seconds()

  avg_time = total_time / 100
  print(avg_time)
  if avg_time < 2:
    tests += 1
  else:
    failed += 1

def test_get_time(uri):
  global tests
  global failed
  total_time = 0

  for _ in range(100):
    response = send_get('/{0}/{1}'.format(uri, user_id), dev_token)
    total_time += response.elapsed.total_seconds()

  avg_time = total_time / 100
  print(avg_time)
  if avg_time < 2:
    tests += 1
  else:
    failed += 1

######################### Test config #########################

parser = argparse.ArgumentParser(description="Test security and authorization checks for Daily Dash backend.")
parser.add_argument('--debug', action='store_true', default=False)
args = parser.parse_args()

logging.basicConfig()
if args.debug:
    logging.getLogger().setLevel(logging.DEBUG)
else:
    logging.getLogger().setLevel(logging.INFO)

######################### Generate functions #########################

def generate_goals():
  for i in range(1000):
    send_post('/goals', dev_token, data={'userId': i,
      "title": i,
      "description": "irrelevant words",
      "shortTermGoals": [
        {
          "title": "Do a coding challenge practice problem each weekday.",
          "mon": [
            5,
            15
          ],
          "wed": [
            30,
            20
          ]
        }
      ]
    }
  )

def generate_users():
  for i in range(1000):
    send_post('/users', dev_token, data={
      "id": i,
      "email": i,
      "username": i,
      "notificationId": "eysn1FN-RhGZ4ptNSqBZyR:APA91bGi5OqkOdoxRosRXmqU5WMEKObJbIdC5QgZQqKX9-BnspCi6LCAsrevL9bFU8pEQp0NXc8YwHVDCHAvTy2YP2C__PZgJX7E5zD7J3guQ9258CsmoMJAT93mQCRttfVIfIpgm56v"
    }
  )

######################### Run tests #########################

# Goals and users already generated on test server
# generate_goals()
# generate_users()

test_post_users_time()
test_post_goals_time()
test_get_time('goals')
test_get_time('users')
test_get_time('goals/suggestedstg')

######################### Summary #########################

logging.info("Testing complete.\n\n")
logging.info("Total tests run: {}".format(tests))
if failed > 0:
    logging.error("Tests failed: {0} ❌".format(failed))
    raise Exception("{0} tests failed".format(failed))
else:
    logging.info("All tests passed!✅")
