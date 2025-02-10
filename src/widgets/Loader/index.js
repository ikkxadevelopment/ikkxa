const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="aspect aspect-[1/1] w-48">
        <video
          controls={false}
          autoPlay
          loop
          muted
          className="object-cover"
          width="100%"
        >
          {/* WebM for modern browsers */}
          <source src="/images/loader.webm" type="video/webm" />
          {/* MP4 fallback */}
          {/* <source src="/videos/video-file.mp4" type="video/mp4" /> */}
          {/* Ogg fallback */}
          {/* <source src="/videos/video-file.ogg" type="video/ogg" /> */}
          {/* Fallback text */}
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Loader;
