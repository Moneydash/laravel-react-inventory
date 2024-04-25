backend_run:
	cd server && php artisan serve
backend_setup:
	cd server && ./BackendSetup.sh
frontend_install:
	cd server && npm install
frontend_run:
	cd client && npm start
frontend_build:
	cd client && npm run build
frontend_prod_run:
	cd client && serve -s build
backend_route_optimize:
	cd server && php artisan route:clear && php artisan route:cache