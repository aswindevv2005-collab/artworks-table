import { useEffect, useRef, useState } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { fetchArtworks } from '../api/artworks';
import { Artwork } from '../types/artwork';

export default function ArtworkTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);


  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());


  const overlayRef = useRef<OverlayPanel>(null);
  const [selectCount, setSelectCount] = useState('');

  const rows = 12;

  useEffect(() => {
    loadData(page);
  }, [page]);

  async function loadData(pageNumber: number) {
    setLoading(true);
    const response = await fetchArtworks(pageNumber);
    setArtworks(response.data);
    setTotalRecords(response.pagination.total);
    setLoading(false);
  }

  
  const selectedRows = artworks.filter(a => selectedIds.has(a.id));

  function onSelectionChange(e: any) {
    const currentPageIds = artworks.map(a => a.id);
    const updated = new Set(selectedIds);

    
    currentPageIds.forEach(id => {
      if (!e.value.some((row: Artwork) => row.id === id)) {
        updated.delete(id);
      }
    });

   
    e.value.forEach((row: Artwork) => updated.add(row.id));

    setSelectedIds(updated);
  }

  function onPageChange(event: DataTablePageEvent) {
    setPage(event.page! + 1);
  }


  function handleCustomSelect() {
    const count = parseInt(selectCount);

    if (!count || count <= 0) return;

    const updated = new Set(selectedIds);

    artworks.slice(0, Math.min(count, artworks.length))
      .forEach(row => updated.add(row.id));

    setSelectedIds(updated);
    overlayRef.current?.hide();
    setSelectCount('');
  }

  return (
    <>
      <Button
        label="Custom Select"
        icon="pi pi-check-square"
        onClick={(e) => overlayRef.current?.toggle(e)}
        className="mb-3"
      />

      <OverlayPanel ref={overlayRef}>
        <div className="flex flex-column gap-2">
          <InputText
            value={selectCount}
            onChange={(e) => setSelectCount(e.target.value)}
            placeholder="Enter number of rows"
          />
          <Button label="Select" onClick={handleCustomSelect} />
        </div>
      </OverlayPanel>

      <DataTable
        value={artworks}
        loading={loading}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        lazy
        first={(page - 1) * rows}
        onPage={onPageChange}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        selectionMode="checkbox"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </>
  );
}
