FROM alpine:latest AS build
WORKDIR /build
RUN apk add --no-cache build-base git pulseaudio-dev unzip autoconf automake
RUN cd /build && git clone https://github.com/dectalk/dectalk.git && cd dectalk/src && ./configure && make -j

FROM alpine:latest
WORKDIR /tmp
ARG SHOW_USAGE USE_APIKEY APIKEY SVC_PATH TEMP_PATH APP_NODE_ENV CLEANUP_FREQUENCY
RUN apk add --no-cache nodejs npm libpulse
COPY tts.js config.js usage.html ./
COPY --from=build /build/dectalk/dist ./dectalk/
RUN mkdir $SVC_PATH && mv tts.js config.js usage.html $SVC_PATH && \
    cd $SVC_PATH && npm install express uuid
RUN mv ./dectalk $SVC_PATH/dectalk && echo -e "\nconfig.paths.service = \"$SVC_PATH/\";\nconfig.paths.temp = \"$TEMP_PATH/\";\nconfig.showUsage = $SHOW_USAGE;\nconfig.useAPIKey = $USE_APIKEY;\nconfig.APIKey = \"$APIKEY\";\nprocess.env.NODE_ENV = \"$APP_NODE_ENV\";" >> $SVC_PATH/config.js && \
       echo -e "#!/bin/sh\nfind $TEMP_PATH -mmin +5 -exec rm *.wav {} \;" > /etc/periodic/$CLEANUP_FREQUENCY/tmp_cleanup.sh && chmod +x /etc/periodic/$CLEANUP_FREQUENCY/tmp_cleanup.sh && \
       echo -e "#!/bin/sh\nexport NODE_ENV=production && cd $SVC_PATH && node tts.js" > /start.sh && chmod +x /start.sh
ENTRYPOINT ["/bin/sh", "/start.sh"]
