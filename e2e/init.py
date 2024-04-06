import subprocess
import time

if __name__ == '__main__':
  print('Starting e2e tests...')
  
  # Then, run the docker containers
  print("Starting new containers...")
  subprocess.run(['docker-compose', 'up', '-d'], check=False)
  
  # Populate the environment with the necessary variables
  print("Populating the environment...")
  # Test is load_dotenv is installed
  try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=".env.test")
  except:
    print("--------------------\n")
    print("TEST FAILED")
    print("Please install python-dotenv")
    print("pip install python-dotenv")
    print("\n--------------------\n")
    exit(1)

  # Run migrations with prisma
  print("Running migrations...")
  try:
    subprocess.run(['npx', 'prisma', 'migrate', 'deploy'], shell=True, check=True)
  except subprocess.CalledProcessError as e:
    print("--------------------\n")
    print("TEST FAILED")
    print("Please make sure that the mariadb has initialized!")
    print("docker-compose up -d")
    print("\n--------------------\n")
    exit(1)
  
  # Then, seed the database with ./e2e/seed.js
  print("Seeding the database...")
  try:
    subprocess.run(['node', 'e2e/seed.js'])  
  except subprocess.CalledProcessError as e:
    print("--------------------\n")
    print("Seed failed")
    print("\n--------------------\n")
    exit(1)
  
  # Then, run the tests
  print("Running tests...")
  
  
  # Finally, stop the containers
  print("Stopping containers...")
  subprocess.run(['docker-compose', 'down'], check=False)
