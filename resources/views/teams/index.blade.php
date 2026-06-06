<div class="card mt-4">
    <div class="card-header bg-dark text-white">
        <h5>Bagan Pertandingan Turnamen (Challonge Bracket)</h5>
    </div>
    <div class="card-body p-0">
        @if(isset($tournament) && $tournament->challonge_id)
            <iframe src="https://challonge.com/{{ $tournament->challonge_id }}/module" 
                    width="100%" 
                    height="500" 
                    frameborder="0" 
                    scrolling="auto" 
                    allowtransparency="true">
            </iframe>
        @else
            <div class="p-3 alert alert-secondary mb-0">
                Bagan turnamen belum dibuat oleh Admin atau data turnamen tidak ditemukan.
            </div>
        @endif
    </div>
</div>