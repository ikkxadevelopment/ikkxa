import { useEffect, useRef } from "react";

const LoadMoreComponent = ({ isLastData, loadMore, isLoadingMore }) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

//   useEffect(() => {
//     const footer = document.querySelector("footer"); 

//     if (footer) {
//         footer.style.display = isLastData ? "none" : "block";
//     } 
//   }, [isLastData]);




  useEffect(() => {
    if (sentinelRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoadingMore && isLastData) {
            loadMore(); // Trigger the loadMore function
          }
        },
        { threshold: 1.0 }
      );

      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
    };
  }, [isLoadingMore, isLastData, loadMore]);

  return (
    <div>
      {isLastData && (
        <div
          ref={sentinelRef}
          className="text-center mt-3"
          style={{ height: "1px", visibility: "hidden" }}
        >
          {/* Sentinel element for triggering loadMore */}
        </div>
      )}
      {isLoadingMore && (
        <div className="text-center mt-3">
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LoadMoreComponent;
