SELECT GCI.GarbageCollectionInvoiceId,GCI.DwellDate, GCI.PriceD, GCI.PriceR, GCI.InvoiceNo, GCI.InvoiceDate,
    V.VoyageVessel, GT.GeneralName AS Status, C.Rate, GCI.UserId
FROM dbo.GarbageCollectionInvoices AS GCI
    INNER JOIN dbo.GeneralTable AS GT ON GT.GeneralCode = GCI.Status
    INNER JOIN dbo.Voyages AS V ON V.VoyageId = GCI.VoyageId
    INNER JOIN dbo.Currencies AS C ON C.CurrencyId = GCI.CurrencyId
    WHERE GT.GeneralType = 3
ORDER BY GCI.GarbageCollectionInvoiceId DESC