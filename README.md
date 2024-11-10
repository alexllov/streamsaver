**React web app to find the fewest streaming services needed to access all film/tv content requested by the user.**

Available at: https://streamsaverapp.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/98c4945e-a93b-4377-894a-e42c2e8caa61/deploy-status)](https://app.netlify.com/sites/streamsaverapp/deploys)

Utilizes TMDB's (The Movie Database) API to find content, and JustWatch (via TMDB) to find streaming details.

This is then processed in line with solutions to the 'set cover optimization problem' (NP-hard) to find the optimal spread of streaming services.
