import json
import requests
import logging
import argparse
import time

expired_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxOTI5ZmY0NWM2MDllYzRjNDhlYmVmMGZiMTM5MmMzOTEzMmQ5YTEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTnlhIE1lbWVzIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tRzNfWng5VkZzbUUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjay1QSVlOdG4zTG1UZHlIM1hzVEthbTlTQVdSZy9zOTYtYy9waG90by5qcGciLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGFpbHlkYXNoLTZkOTc5IiwiYXVkIjoiZGFpbHlkYXNoLTZkOTc5IiwiYXV0aF90aW1lIjoxNjA0ODEwOTk2LCJ1c2VyX2lkIjoiVnRVaE1wMmF3YVBIOW1JcmxPSTNVQUR3Z2o3MyIsInN1YiI6IlZ0VWhNcDJhd2FQSDltSXJsT0kzVUFEd2dqNzMiLCJpYXQiOjE2MDQ4MTA5OTYsImV4cCI6MTYwNDgxNDU5NiwiZW1haWwiOiJueWFtZW1lc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNDk3NTg2MDUwOTcyNjIyNDU2MCJdLCJlbWFpbCI6WyJueWFtZW1lc0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.not3iRfV3vruiAEkq9j4T4kIypofOIqW0sGw-DNaCbekkKYm7XuFHPP4YEZZD9Um7xyJT-IOzJ3yqW5jhumdjBwxMw72JmZ5hbt7m7OtQgtuwn-9Uxai0-P_6icSdUv1EVeO7apaI611QsxhpNwsq8x-sRQBgbmIfjpdXQ3rvPXTIsAUJirrR2-C-FRWEdbdo0sf63DRn-AUcAGPxHxijJRmE3jxRFQkXI5zRdZXFC-LP4ZjP3TvUg4poEPwM47uFaeBysa0aFQ3HN6wZVVqUpAQdspEOfRcq5NnOg2vX5ggB54DMtikK3UsDsj3vlGOrZsjQ7E2En3SCButv0ZUBw"
user_id = 'RPeq88j3J7YPusoSsRcHg5rXepn1'
base_url = "http://18.224.140.58:3000"

failed = 0
tests = 0

######################### Test methods #########################
# Write new tests below this section

def get_header(token: str) -> dict:
    """Get the HTTP header for a given token

    Parameters:
    token (str): auth token (JWT)

    Returns:
    dict: the headers for the HTTP request
    """
    return {'Content-Type': 'application/json',
           'Authorization': 'Bearer {0}'.format(token)}

def check_if_unauthorized(response, endpoint: str):
    """Check if the resposne returned with 401 unauthorized. Log as an error if not.

    Parameters:
    respone (request.response): response to HTTP request
    endpoint (str): the endpoint that was hit during the request
    """
    global failed
    time.sleep(0.1)
    if not response.status_code == 401:
        failed += 1
        logging.debug("Got response: {}".format(response.status_code))
        logging.debug(response.content)
        logging.error("Endpoint {0} is not secure ❌".format(endpoint))
    else:
        logging.info("Endpoint {0} is secure ✅".format(endpoint))

def test_get(endpoint: str, token: str, params={}):
    """Test an endpoint that uses a get REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    params (dict): parameters for get request
    """
    global tests
    tests += 1
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    response = requests.get(url, params=params, headers=headers)
    check_if_unauthorized(response, endpoint)

def test_delete(endpoint: str, token: str):
    """Test an endpoint that uses a delete REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    """
    global tests
    tests += 1
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    response = requests.delete(url, headers=headers)
    check_if_unauthorized(response, endpoint)

def test_post(endpoint: str, token: str, body={}):
    """Test an endpoint that uses a post REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    body (dict): NOT USED - body for the post request
    """
    global tests
    tests += 1
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    data = {}
    # data['body'] = json.dumps(body)
    response = requests.post(url, data=data, headers=headers)
    check_if_unauthorized(response, endpoint)

def test_put(endpoint: str, token: str, body={}):
    """Test an endpoint that uses a put REST request

    Parameters:
    endpoint (str): endpoint to test
    token (str): auth token (JWT) for headers
    body (dict): NOT USED - body for the post request
    """
    global tests
    tests += 1
    headers = get_header(token)
    url = '{0}{1}'.format(base_url, endpoint)
    data = {}
    # data['body'] = json.dumps(body)
    response = requests.put(url, data=data, headers=headers)
    check_if_unauthorized(response, endpoint)

######################### Test config #########################

parser = argparse.ArgumentParser(description="Test security and authorization checks for Daily Dash backend.")
parser.add_argument('--debug', action='store_true', default=False)
args = parser.parse_args()

logging.basicConfig()
if args.debug:
    logging.getLogger().setLevel(logging.DEBUG)
else:
    logging.getLogger().setLevel(logging.INFO)

######################### Run tests #########################
# Note: Body has no effect, I could not get it working

# users
test_get('/users/{0}'.format(user_id), expired_token)
test_delete('/users/{0}/notification?token=123456'.format(user_id), expired_token)
test_post('/users', expired_token, body={'id': '123', 'email': 'ase@sfsf.com', 'username': 'bob', 'notificationId': 'notid'})

# goals
test_get('/goals'.format(user_id), expired_token)
test_get('/goals/shortterm', expired_token)
test_get('/goals/suggestedstg', expired_token)
test_post('/goals', expired_token, body={'id': '123'})
test_put('/goals/shortterm/counter', expired_token, body={'userId': user_id, 'shortTermGoalId': '23155198'})

######################### Summary #########################

logging.info("Testing complete.\n\n")
logging.info("Total tests run: {}".format(tests))
if failed > 0:
    logging.error("Tests failed: {0} ❌".format(failed))
else:
    logging.info("All tests passed! All are secure. ✅")
